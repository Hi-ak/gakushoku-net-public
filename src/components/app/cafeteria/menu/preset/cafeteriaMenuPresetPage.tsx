"use client";
import { Menu, MenuCategory, PresetInfo } from "@/common/types/menu";
import styles from "@/common/styles/app/menu/preset.module.scss";
import React, { CSSProperties, ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SaveButton } from "@/components/buttons/SaveButton";
import { jsonFetch } from "@/common/utils/customFetch";
import { ApiResponse } from "@/common/types/apiResponse";

import { get7Days, getDateString, removeEmptyElements } from "./utility";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnResizeMode,
  ColumnResizeDirection,
  Column,
  ColumnDef,
  RowData,
} from "@tanstack/react-table";

import _isEqual from "lodash/isEqual";
import { SavePresetPostBody } from "@/app/api/cafeteria/menu/save-preset/route";

import { StatusIndicator } from "@/components/loading/statusIndicator";
import { StatusValue } from "@/components/loading/statusIndicator";
import { PresetMenu } from "@/common/types/menu";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}
//せる1つに対応
class ContentByDate {
  date: Date;
  dateString: string;
  contents: string[];
  contentsString: string;
}

//列1つに対応
class MenuRow {
  id: string;
  title: string;
  contentByDateList: ContentByDate[];
}

const TYPE_END_SEC = 2000; //ユーザーが3秒タイピングを止めたら、dataの変更を確認

//cell内でinputフィールドが使えるようにcellを設定 https://tanstack.com/table/v8/docs/framework/react/examples/editable-data
const defaultColumn: Partial<ColumnDef<MenuRow>> = {
  //テンプレートだとbuildエラー: function Cell() ...というふうに書くと治る
  cell: function Cell({ getValue, row: { index }, column: { id }, table }) {
    const initialValue = getValue();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(initialValue);
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    //onBlurが発動しなくても、入力が2秒間止まってて値が変更されていたら勝手に更新リクエストを送る
    //なぜか最初に「new data: 」が大量に出るバグがあるが大きな問題ではないはず（フロントでの処理が重くなる）
    const [typeTerm, setTypeTerm] = useState("");
    React.useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        table.options.meta?.updateData(index, id, value);
      }, TYPE_END_SEC);
      return () => clearTimeout(delayDebounceFn);
    }, [typeTerm]);

    return (
      // 改行できるようにするためにtextarea
      <textarea
        className={styles.cell}
        value={value as string}
        onChange={(e) => {
          setValue(e.target.value);
          if (e.target.value !== value) {
            setTypeTerm(e.target.value); //タイピング中なので更新リクエストを延期
          }
        }}
        onBlur={onBlur}
      />
    );
  },
};

export const CafeteriaMenuPresetPageComponent: React.FC<{
  categories: MenuCategory[];
  presetInfos: PresetInfo[];
}> = ({ categories, presetInfos }) => {
  const router = useRouter();

  //スクロール可能に
  const [columnResizeMode, setColumnResizeMode] =
    useState<ColumnResizeMode>("onChange");

  const [columnResizeDirection, setColumnResizeDirection] =
    useState<ColumnResizeDirection>("ltr");

  //明日からの7日間のdate[]をget
  const DAYS = get7Days();

  const dailyMenus = Object.values(categories)
    .map((category) => category.menus)
    .flat();

  //dailyMenus を列ごとの情報に変換
  const defaultMenuRows = dailyMenus.map((menu) => {
    const menuRow = new MenuRow(); //メニューごとにRowを作る
    menuRow.id = menu.id;
    menuRow.title = menu.title;
    menuRow.contentByDateList = [];
    for (const day of DAYS) {
      let presetInfo: PresetInfo;
      for (const p of presetInfos) {
        if (
          p.year == day.getFullYear() &&
          p.month == day.getMonth() + 1 &&
          p.date == day.getDate()
        ) {
          presetInfo = p;
          break;
        }
      }

      const contentByDate = new ContentByDate();
      contentByDate.date = day;
      contentByDate.dateString = getDateString(day);

      contentByDate.contents = [...menu.contents];
      contentByDate.contentsString = menu.contents.join("\n");
      if (presetInfo) {
        for (const pMenu of presetInfo.presetMenus) {
          //すでにpresetMenuの設定がしてあるセルはそれを先に入れておく
          if (menu.id === pMenu.menuId) {
            contentByDate.contents = [...pMenu.contents];
            contentByDate.contentsString = pMenu.contents.join("\n");
          }
        }
      }

      menuRow.contentByDateList.push(contentByDate);
    }
    return menuRow;
  });

  //dataの中に最新の入力情報が入っている
  const [data, setData] = useState(defaultMenuRows);

  const columnHelper = createColumnHelper<MenuRow>();

  //一番左のセルを先に挿入
  let columns = [
    columnHelper.accessor((menu) => menu.title, {
      id: "titles",
      header: "メニュー名",
      cell: (info) => (
        <div className={`${styles.cell} ${styles.labelCell}`}>
          <h3 className={styles.label}>{info.getValue()}</h3>
        </div>
      ),
    }),
  ];

  for (const day of DAYS) {
    const accesor = columnHelper.accessor(
      (menuRow) =>
        //セルの中身を関数にして指定
        menuRow.contentByDateList.filter(
          (cbd) => cbd.dateString === getDateString(day)
        )[0].contentsString,
      {
        id: getDateString(day), //getDateString(day)をcolumnIdする
        header: getDateString(day),
        //cellの中身はdefaultColumnで指定
      }
    );

    //コラムを追加
    columns.push(accesor);
  }

  //テーブルを作成
  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    columnResizeMode,
    columnResizeDirection,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      //入力が終わるごとにdata変数をアップデート
      updateData: (rowIndex, columnId, value: string) => {
        // Skip page index reset until after next rerender
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              //列はクリック時にわかる。 rowにはMenuRowが入っている
              //MenuRowの内容をカーソルが上がったら更新
              //columnIdはgetDateString(day)を入れてある
              const contentByDate = row.contentByDateList.filter((cbd) => {
                return cbd.dateString === columnId; //dateStringが一致している行
              })[0];

              const previous = [...contentByDate.contents];

              contentByDate.contentsString = value;
              contentByDate.contents = value.split("\n");
              contentByDate.contents = removeEmptyElements(
                contentByDate.contents
              );

              if (!_isEqual(previous, contentByDate.contents)) {
                setSaveStatus(StatusValue.Loading);
                setMessage("保存中");
                jsonFetch("/api/cafeteria/menu/save-preset", "POST", {
                  menuId: row.id,
                  year: contentByDate.date.getFullYear(),
                  month: contentByDate.date.getMonth() + 1,
                  date: contentByDate.date.getDate(),
                  contents: contentByDate.contents, //更新されたコンテンツ
                } as SavePresetPostBody)
                  .then((response) => {
                    return response.json();
                  })
                  .then((result) => {
                    setSaveStatus(StatusValue.Ok);
                    setMessage("保存済み");
                  });
              }
            }
            return row;
          })
        );
      },
    },
  });

  //保存のステータスを表示

  const [saveStatus, setSaveStatus] = useState<StatusValue>(StatusValue.Ok);
  const [message, setMessage] = useState<string>("セルを編集してください");

  return (
    <div className={styles.menu}>
      <StatusIndicator status={saveStatus} message={message} />
      <div className={styles.editorContainer}>
        <table className={styles.editorTable}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => {
                  const { column } = header;
                  return (
                    <th
                      key={header.id}
                      className={`${styles.headerCell} ${
                        //一番左のセルなら固定
                        idx === 0 ? styles.labelCell : null
                      }`}
                      style={idx === 0 ? { ...getLeftPinStyles(column) } : {}}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell, idx) => {
                  const { column } = cell;
                  return (
                    <td
                      key={cell.id}
                      className={idx === 0 ? styles.labelCell : null}
                      style={idx === 0 ? getLeftPinStyles(column) : null}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

//左のメニュー名は左側に固定
const getLeftPinStyles = (column: Column<MenuRow>): CSSProperties => {
  return {
    boxSizing: "content-box",
    left: `${column.getStart("left")}px`,
    opacity: 1,
    position: "sticky",
    width: column.getSize(),
    zIndex: 1,
  };
};
export default CafeteriaMenuPresetPageComponent;
