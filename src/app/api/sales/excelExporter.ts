import * as XLSX from "xlsx-js-style";
import * as path from "path";

// xlsx-styleで、Module not found: Can't resolve './cptable'とでたら、
// https://github.com/protobi/js-xlsx/issues/78

// import * as XLSTYLE from "xlsx-style";
import * as fs from "fs";

import {
  BORDER_AROUND,
  BROWN_BG,
  SATURDAY,
  SUNDAY,
  TATEGAKI,
  getWeekday,
} from "./excelStyles";

import {
  Menu,
  MenuCategory,
  MenuOption,
  OptionChoice,
} from "@/common/types/menu";
import { Ticket } from "@/common/types/ticket";
import {
  getHourTimeDelta,
  getMinuteTimeDelta,
} from "@/common/var/cafeteriaTime";

// XLSX.set_fs(fs);

// 使用例
// const categoriesAndMenus = [
//   {
//     categoryHandle: "regular",
//     categoryName: "定番",
//     index: 0,
//     menus: [
//       {
//         id: "0d64a4a9-67b2-490c-9d69-f20929a8a42b",
//         title: "天ぷらうどん",
//         price: 350,
//       },
//       {
//         id: "04411885-6c5b-4a3c-896c-fdf307e6b2f0",
//         title: "かけうどん",
//         price: 240,
//       },
//       {
//         id: "9d5d52c8-4f32-4306-8cd9-34622a796add",
//         title: "かつ丼",
//         price: 420,
//       },
//       {
//         id: "6c9df399-8916-48e0-a938-ad67e7492a6c",
//         title: "中華丼",
//         price: 420,
//       },
//       {
//         id: "e03b8d08-1645-4100-b280-4676f7daee0d",
//         title: "ミニサラダ",
//         price: 120,
//       },
//       {
//         id: "1cf44255-dd93-46c1-bae2-08c36c1118ea",
//         title: "サラダ",
//         price: 230,
//       },
//       {
//         id: "d7a95a68-8777-497f-a879-59b8212e7bb5",
//         title: "広東麺",
//         price: 450,
//       },
//       {
//         id: "29be5515-4938-43d9-922e-e128113e9799",
//         title: "カレーうどん",
//         price: 350,
//       },
//       {
//         id: "5133275e-6182-4d69-a1b5-c4cfcda44820",
//         title: "カレーライス",
//         price: 330,
//       },
//       {
//         id: "0553e9b7-91cd-4c98-8c67-922df22fa770",
//         title: "カツカレー",
//         price: 450,
//       },
//       {
//         id: "3c74ad18-1064-4aec-920d-b6e0df88eebd",
//         title: "トッピングカレー",
//         price: 450,
//       },
//       {
//         id: "297a7e86-4d19-4398-812b-ca768e502509",
//         title: "ラーメン",
//         price: 360,
//       },
//       {
//         id: "78243afe-fca1-430d-ac44-067dc4d75f2d",
//         title: "冷やし天ぷらうどん",
//         price: 380,
//       },
//     ],
//   },
//   {
//     categoryHandle: "special",
//     categoryName: "日替わりランチ",
//     index: 1,
//     menus: [
//       { id: "0dee477a-0786-4589-bc9d-72538214d679", title: "C丼", price: 420 },
//       {
//         id: "32529a96-86d5-4c0e-bcdf-d31e7555cd4b",
//         title: "Aランチ",
//         price: 490,
//       },
//       {
//         id: "98b9fd44-a49b-474a-a9e9-f72cee2ef0b8",
//         title: "Bランチ",
//         price: 490,
//       },
//     ],
//   },
// ];

// const options = [
//   {
//     id: "2ce5fd8c-4314-4b53-aacc-e46d26c41db9",
//     optionName: "カレーライス",
//     choiceList: [
//       {
//         id: "0709d29f-763c-4682-9b22-f5c6c04398c4",
//         choiceName: "カレーに変更",
//         priceDiff: 0,
//         isDefault: false,
//         choiceHandle: "カレーに変更",
//       },
//       {
//         id: "dcfa4a3d-3709-40ed-9c42-566cb3de83de",
//         choiceName: "変更なし",
//         priceDiff: 0,
//         isDefault: true,
//         choiceHandle: "変更なし",
//       },
//     ],
//   },
//   {
//     id: "502082fc-36fe-4902-9b41-4df92346bd3a",
//     optionName: "大盛り100円",
//     choiceList: [
//       {
//         id: "049385e0-05b1-49d4-8e95-c1452122acd4",
//         choiceName: "なし",
//         priceDiff: 0,
//         isDefault: true,
//         choiceHandle: "なし",
//       },
//       {
//         id: "0fac6f40-c030-407d-ad9a-62def5a386e8",
//         choiceName: "大盛り",
//         priceDiff: 100,
//         isDefault: false,
//         choiceHandle: "大盛り",
//       },
//     ],
//   },
//   {
//     id: "ba1e407a-ce0d-43f7-8841-b2c83c90a712",
//     optionName: "にんにくマシマシ",
//     choiceList: [
//       {
//         id: "de89e220-a436-402d-923b-65f49b775979",
//         choiceName: "なし",
//         priceDiff: 0,
//         isDefault: true,
//         choiceHandle: "なし",
//       },
//       {
//         id: "74686cc1-8fe2-433b-9709-d6b5e60e3aff",
//         choiceName: "マシマシ",
//         priceDiff: 200,
//         isDefault: false,
//         choiceHandle: "マシマシ",
//       },
//     ],
//   },
// ];

// const data = [
//   {
//     menuRelation: {
//       id: "32529a96-86d5-4c0e-bcdf-d31e7555cd4b",
//       title: "Aランチ",
//       price: 490,
//       categoryHandle: "special",
//     },
//     options: [
//       {
//         id: "e67bb223-9d94-45ae-b907-21be23f16f46",
//         optionRelation: { id: "502082fc-36fe-4902-9b41-4df92346bd3a" },
//         choiceRelation: {
//           id: "0fac6f40-c030-407d-ad9a-62def5a386e8",
//           choiceName: "大盛り",
//           priceDiff: 100,
//           isDefault: false,
//           choiceHandle: "大盛り",
//         },
//         ticketId: "f1ef46ca-11cf-4a07-89df-a3d8430ebee3",
//       },
//     ],
//     createdAt: "2024-07-11T16:22:55.172Z",
//   },
//   {
//     menuRelation: {
//       id: "78243afe-fca1-430d-ac44-067dc4d75f2d",
//       title: "冷やし天ぷらうどん",
//       price: 380,
//       categoryHandle: "regular",
//     },
//     options: [
//       {
//         id: "3ac3aa79-2ec0-4abc-aa52-9922419fa289",
//         optionRelation: { id: "502082fc-36fe-4902-9b41-4df92346bd3a" },
//         choiceRelation: {
//           id: "0fac6f40-c030-407d-ad9a-62def5a386e8",
//           choiceName: "大盛り",
//           priceDiff: 100,
//           isDefault: false,
//           choiceHandle: "大盛り",
//         },
//         ticketId: "cb82e048-a08b-46a8-a233-9f63a089c786",
//       },
//     ],
//     createdAt: "2024-07-12T03:50:02.520Z",
//   },
//   {
//     menuRelation: {
//       id: "3c74ad18-1064-4aec-920d-b6e0df88eebd",
//       title: "トッピングカレー",
//       price: 450,
//       categoryHandle: "regular",
//     },
//     options: [
//       {
//         id: "52938237-69e1-4334-b15d-07a7b26f60c4",
//         optionRelation: { id: "502082fc-36fe-4902-9b41-4df92346bd3a" },
//         choiceRelation: {
//           id: "0fac6f40-c030-407d-ad9a-62def5a386e8",
//           choiceName: "大盛り",
//           priceDiff: 100,
//           isDefault: false,
//           choiceHandle: "大盛り",
//         },
//         ticketId: "71d87d4f-33bd-44b0-93ae-98b7fd02ed48",
//       },
//     ],
//     createdAt: "2024-07-12T05:31:03.747Z",
//   },
//   {
//     menuRelation: {
//       id: "0d64a4a9-67b2-490c-9d69-f20929a8a42b",
//       title: "天ぷらうどん",
//       price: 350,
//       categoryHandle: "regular",
//     },
//     options: [
//       {
//         id: "eea324a1-c41e-4bef-8a77-7844ff7b238e",
//         optionRelation: { id: "502082fc-36fe-4902-9b41-4df92346bd3a" },
//         choiceRelation: {
//           id: "049385e0-05b1-49d4-8e95-c1452122acd4",
//           choiceName: "なし",
//           priceDiff: 0,
//           isDefault: true,
//           choiceHandle: "なし",
//         },
//         ticketId: "1e898a77-7320-40fd-a456-14413af15f03",
//       },
//     ],
//     createdAt: "2024-07-12T05:31:03.747Z",
//   },
//   {
//     menuRelation: {
//       id: "32529a96-86d5-4c0e-bcdf-d31e7555cd4b",
//       title: "Aランチ",
//       price: 490,
//       categoryHandle: "special",
//     },
//     options: [
//       {
//         id: "00a757d1-a537-4d02-8de4-eaedc623efcd",
//         optionRelation: { id: "502082fc-36fe-4902-9b41-4df92346bd3a" },
//         choiceRelation: {
//           id: "0fac6f40-c030-407d-ad9a-62def5a386e8",
//           choiceName: "大盛り",
//           priceDiff: 100,
//           isDefault: false,
//           choiceHandle: "大盛り",
//         },
//         ticketId: "6d2a181d-f356-4373-b067-8385f3188248",
//       },
//     ],
//     createdAt: "2024-07-12T15:51:44.369Z",
//   },
// ];

// const year = 2024;
// const month = 7;

// writeFile(
//   categoriesAndMenus as MenuCategory[],
//   options as MenuOption[],
//   data,
//   year,
//   month
// );

const MAX_ROW_NUM = 40;
const MAX_COLUMN_NUM = 40;
const COMMISSION_FEE_RATE = 0.02;

export async function exportSalesData(
  categoriesAndMenus: MenuCategory[],
  options: MenuOption[],
  soldTickets: Ticket[],
  year: number,
  month: number
) {
  var wb = XLSX.utils.book_new();

  const END_OF_MONTH = new Date(year, month, 0).getDate(); //その月の最後の日

  let cells = initializeCells();

  //日付と曜日を入力

  insertDatesAndWeekdays(cells, END_OF_MONTH, year, month);

  const menus = categoriesAndMenus
    .sort((cat1, cat2) => cat2.index - cat1.index)
    .map((cat) => cat.menus)
    .flat();

  const menuSalesInfo = {};
  const optionSalesInfo = {};

  const salesInfo = {}; // menuとoptionはsalesInfoの中にまとめる

  // salesInfoの構造
  // key: menuId / optionId
  // value: {
  //   label: menu.title / option.optionName
  //   price: menu.price / optionの有料choiceのpriceDiff
  //   totalSold: 月間総売上
  //   salesByDay: {
  //     key: "1", "2" ... "31"(END_OF_MONTH)
  //     value: そのmenu/optionが売れた数
  //   }
  // }

  const totalSalesByDay = {};
  //↑1日ごとに、売り上げた総商品数 13日に、Aランチ1枚　Bランチ2枚 大盛り1枚を売り上げた場合{ "13": 4 }のようになる

  //salesInfo & totalSalesByDayを初期化

  initializeSalesInfo(salesInfo, menus as Menu[], options, END_OF_MONTH);

  initializeTotalSalesByDay(totalSalesByDay, END_OF_MONTH);

  // soldTicketsをsalesInfo, totalSalesByDayに破壊的に反映させる
  // totalSoldAmountInMonth: 注文された食券（大盛り等のオプションを含む）の枚数
  // totalSalesInMonth: 月の総売上高
  const { totalSoldAmountInMonth, totalSalesInMonth } =
    await convertSoldTickets2SalesInfo(soldTickets, salesInfo, totalSalesByDay);

  //cellsは破壊的に変更 colIdxは「総合計」の行を指す
  const colIdx = insertSalesInfo2Cells(
    cells,
    salesInfo,
    totalSalesByDay,
    totalSoldAmountInMonth,
    totalSalesInMonth,
    END_OF_MONTH
  );

  //sheet["!ref"] = "A1:BZ48"; シートを直で編集するなら必要
  const sheet = XLSX.utils.aoa_to_sheet(cells, {
    cellDates: true,
    cellStyles: true,
  });

  // sheet["!cols"] = fitToColumn(completed);　セルの横幅を自動で調整してくれるものだが、うまくいかなかった

  //sheetのwidthを指定
  sheet["!cols"] = [];

  for (let i = 0; i < colIdx; i++) {
    sheet["!cols"][i] = { wch: 5 };
  }
  //曜日の行は細めに
  sheet["!cols"][1] = { wch: 2 };

  XLSX.utils.book_append_sheet(wb, sheet, "アプリ販売数");

  const filePath = `temp/${year}-${month}.xlsx`;

  XLSX.writeFile(wb, filePath, {});

  return filePath;
}

function initializeCells() {
  var cells: Array<Object>[] = [];
  for (let r = 0; r < MAX_ROW_NUM; r++) {
    cells.push(new Array(MAX_COLUMN_NUM).fill(null));
  }

  return cells;
}

function insertDatesAndWeekdays(
  cells: Array<Object>[],
  endOfMonth: number,
  year: number,
  month: number
) {
  for (let d = 1; d <= endOfMonth; d++) {
    const date = new Date(year, month - 1, d);

    //日付
    cells[d + 1][0] = {
      t: "d",
      v: date
        .toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replaceAll("/", "-"),
      z: "m/d",
    };

    //曜日
    cells[d + 1][1] = {
      v: getWeekday(date.getDay()),
      ...(date.getDay() === 0 && {
        s: {
          ...SUNDAY, // 文字色を日曜なら赤にする
        },
      }),
      ...(date.getDay() === 6 && {
        s: {
          ...SATURDAY,
        },
      }),
    };
  }
}

function initializeSalesInfo(
  salesInfo: Object,
  menus: Menu[],
  options: MenuOption[],
  endOfMonth: number
) {
  for (const menu of menus) {
    salesInfo[menu.id!] = {
      label: menu.title,
      price: menu.price,
      totalSold: 0,
      salesByDay: {},
    };
  }

  for (const option of options) {
    salesInfo[option.id!] = {
      label: option.optionName,
      price: option.choiceList?.filter((choice) => !choice.isDefault)[0]
        .priceDiff,
      totalSold: 0,
      salesByDay: {},
    };
  }

  for (const id in salesInfo) {
    for (var d = 1; d <= endOfMonth; d++) {
      salesInfo[id].salesByDay[d] = 0;
    }
  }
}

function initializeTotalSalesByDay(
  totalSalesByDay: Object,
  endOfMonth: number
) {
  for (let d = 1; d <= endOfMonth; d++) {
    totalSalesByDay[d] = { amount: 0, sales: 0 }; //個数、金額
  }
}

async function convertSoldTickets2SalesInfo(
  soldTickets: Ticket[],
  salesInfo: Object,
  totalSalesByDay: Object
) {
  let totalSoldAmountInMonth = 0;
  let totalSalesInMonth = 0;
  for (let ticket of soldTickets) {
    const purchaseJST = new Date(ticket.createdAt!);
    purchaseJST.setUTCHours(
      purchaseJST.getUTCHours() + (await getHourTimeDelta("kaisei")),
      purchaseJST.getUTCMinutes() + (await getMinuteTimeDelta("kaisei"))
    );
    const purchaseDate = purchaseJST.getDate();

    salesInfo[ticket.menuRelation.id!].salesByDay[purchaseDate]++;
    salesInfo[ticket.menuRelation.id!].totalSold++;

    totalSalesByDay[purchaseDate].amount++;
    totalSalesByDay[purchaseDate].sales +=
      salesInfo[ticket.menuRelation.id!].price;

    totalSoldAmountInMonth++;
    totalSalesInMonth += salesInfo[ticket.menuRelation.id!].price;

    for (let ticketOption of ticket.options) {
      if (ticketOption.choiceRelation.priceDiff) {
        salesInfo[ticketOption.optionRelation.id].salesByDay[purchaseDate]++;
        salesInfo[ticketOption.optionRelation.id].totalSold++;

        totalSalesByDay[purchaseDate].amount++;
        totalSalesByDay[purchaseDate].sales +=
          salesInfo[ticketOption.optionRelation.id].price;

        totalSoldAmountInMonth++;
        totalSalesInMonth += salesInfo[ticketOption.optionRelation.id].price;
      }
    }
  }

  return { totalSoldAmountInMonth, totalSalesInMonth };
}

function insertSalesInfo2Cells(
  cells: Array<Object>[],
  salesInfo: Object,
  totalSalesByDay: Object,
  totalSoldAmountInMonth: number,
  totalSalesInMonth: number,
  endOfMonth: number
) {
  let colIdx = 2;

  for (let menuId in salesInfo) {
    //メニュー名
    cells[0][colIdx] = {
      v: salesInfo[menuId].label,
      s: {
        ...TATEGAKI,
      },
    };

    //価格
    cells[1][colIdx] = {
      t: "n",
      v: salesInfo[menuId].price,
    };

    //1日からその月の終わりの日までのそれぞれの日毎の売上数を挿入
    for (let date in salesInfo[menuId].salesByDay) {
      cells[parseInt(date) + 1][colIdx] = {
        t: "n",
        v: salesInfo[menuId].salesByDay[date],
      };
    }

    //総売上食数
    cells[endOfMonth + 3][colIdx] = {
      t: "n",
      v: salesInfo[menuId].totalSold,
    };

    //1日の平均売上数
    cells[endOfMonth + 4][colIdx] = {
      t: "n",
      v: Math.round(salesInfo[menuId].totalSold / endOfMonth),
    };

    //全体の注文数に占める割合
    cells[endOfMonth + 6][colIdx] = {
      t: "n",
      v: `${
        Math.round(
          (salesInfo[menuId].totalSold / totalSoldAmountInMonth) * 10000
        ) / 100
      }%`,
      z: "0.00%",
    };

    colIdx++;
  }

  colIdx += 1;

  //総合計・売上・手数料の行
  for (const date in totalSalesByDay) {
    //1日ごとの総食数
    cells[parseInt(date) + 1][colIdx] = {
      t: "n",
      v: totalSalesByDay[date].amount,
      s: {
        ...BROWN_BG,
      },
    };
    //1日ごとの総売上
    cells[parseInt(date) + 1][colIdx + 1] = {
      t: "n",
      v: totalSalesByDay[date].sales,
    };

    //1日ごとの手数料
    cells[parseInt(date) + 1][colIdx + 2] = {
      t: "n",
      v: Math.round(totalSalesByDay[date].sales * COMMISSION_FEE_RATE),
    };
  }

  //月の総食数
  cells[endOfMonth + 3][colIdx] = {
    t: "n",
    v: totalSoldAmountInMonth,
  };

  //総売上
  cells[endOfMonth + 3][colIdx + 1] = {
    t: "n",
    v: totalSalesInMonth,
  };

  //総手数料
  cells[endOfMonth + 3][colIdx + 2] = {
    t: "n",
    v: Math.round(totalSalesInMonth * COMMISSION_FEE_RATE),
  };

  //1日ごとの平均食数
  cells[endOfMonth + 4][colIdx] = {
    t: "n",
    v: Math.round(totalSoldAmountInMonth / endOfMonth),
  };

  //1日ごとの平均売上
  cells[endOfMonth + 4][colIdx + 1] = {
    t: "n",
    v: Math.round(totalSalesInMonth / endOfMonth),
  };

  //メニュー及び売上の全てのセルにボーダーをつける
  for (var r = 0; r <= endOfMonth + 1; r++) {
    for (var c = 0; c <= colIdx + 2; c++) {
      if (!cells[r][c]) {
        cells[r][c] = { v: "" };
        // cells[r][c].s = BORDER_AROUND;
        continue;
      }
      // cells[r][c].s = { ...cells[r][c].s, ...BORDER_AROUND };
    }
  }

  //ラベルをつける
  cells = putLabels(cells, endOfMonth, colIdx);

  return colIdx;
}

function putLabels(cells, endOfMonth, colIdx) {
  cells[endOfMonth + 3][0] = "売上数";
  cells[endOfMonth + 4][0] = "日平均";
  cells[endOfMonth + 6][0] = "総合計に占める割合";
  cells[0][colIdx] = {
    v: "総合計",
    s: {
      ...BROWN_BG,
      ...TATEGAKI,
      ...BORDER_AROUND,
    },
  };
  cells[1][colIdx] = {
    v: "",
    s: {
      ...BROWN_BG,
      ...BORDER_AROUND,
    },
  };
  cells[0][colIdx + 1] = {
    v: "売上",
    s: {
      ...TATEGAKI,
      ...BORDER_AROUND,
    },
  };
  cells[0][colIdx + 2] = {
    v: "手数料",
    s: {
      ...TATEGAKI,
      ...BORDER_AROUND,
    },
  };

  return cells;
}

function fitToColumn(arrayOfArray) {
  // get maximum character of each column
  return arrayOfArray[0].map((a, i) => ({
    wch: Math.max(
      ...arrayOfArray.map((a2) => (a2[i] ? a2[i].toString().length : 0))
    ),
  }));
}
