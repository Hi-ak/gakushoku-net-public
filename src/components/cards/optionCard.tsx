"use client";
import styles from "@/common/styles/components/cards/optionCard.module.scss";
import { MenuOption } from "@/common/types/menu";
import { InputField } from "../inputs/inputField";
import { useEffect, useRef, useState } from "react";
import { Alert } from "../modals/alert";
import { NormalAlertContainer } from "../modals/ui";
import { ModalButton } from "./modalButton";
import { RadioButton } from "../inputs/radioButton";
import Icon from "@mdi/react";
import { mdiPlus, mdiPlusCircleOutline, mdiTrashCanOutline } from "@mdi/js";
import type {
  OptionDeleteBody,
  OptionPostBody,
  OptionPostResponse,
  OptionPutBody,
} from "@/app/api/cafeteria/option/route";
import { jsonFetch } from "@/common/utils/customFetch";
import { TextWithLoadingIcon } from "../loading/textWithLoadingIcon";
import { LoadingIcon } from "../loading/loadingIcon";
import { logger } from "@/common/utils/logger";

// This system is specifically for Kaisei's cafeteria menu options
export const CafeteriaOptionCard: React.FC<{
  option: MenuOption;
  options: MenuOption[];
  setOptions: React.Dispatch<React.SetStateAction<MenuOption[]>>;
}> = ({ option: defaultOption, options, setOptions }) => {
  const [option, setOption] = useState<MenuOption>(defaultOption);
  const [alertText, setAlertText] = useState<string>("");
  const [alertActive, setAlertActive] = useState<boolean>(false);
  const [addContentHandle, setAddContentHandle] = useState<string>(null);
  const [addContentPrice, setAddContentPrice] = useState<number>(0);
  const addContentHandleRef = useRef<HTMLInputElement>(null);
  const addCotnentPriceRef = useRef<HTMLInputElement>(null);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const resetAdd = () => {
    setAddContentHandle(null);
    setAddContentPrice(0);
    addContentHandleRef.current.value = "";
    addCotnentPriceRef.current.value = "0";
  };
  useEffect(() => {
    if (JSON.stringify(option) !== JSON.stringify(defaultOption)) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [option, defaultOption]);
  return (
    <div className={styles.optionCardContainer}>
      <div className={styles.name}>
        <InputField
          onBlur={(e) => {
            if (e.target.value === "") {
              e.target.value = option.optionHandle;
              setAlertText("オプション名は必須です");
              setAlertActive(true);
              return;
            } else if (
              options
                .filter((o) => o.id !== option.id)
                .map((o) => o.optionHandle)
                .includes(e.target.value)
            ) {
              e.target.value = option.optionHandle;
              setAlertText(
                "同じオプション名を複数のオプションにつけることはできません"
              );
              setAlertActive(true);
              return;
            }
            setOption({
              ...option,
              optionHandle: e.target.value,
              optionName: e.target.value,
            });
          }}
          defaultVal={option.optionHandle}
          placeHolder="オプション名を入力"
        />
      </div>
      <div className={styles.choicesContainer}>
        <p>選択肢</p>
        <div className={styles.choices}>
          <div className={[styles.choice, styles.head].join(" ")}>
            <div className={styles.radioButton}>デフォルト</div>
            <div className={styles.choiceHandle}>名前</div>
            <div className={styles.price}>価格</div>
          </div>
          {option.choiceList.map((choice, idx) => (
            <div key={choice.choiceHandle} className={styles.choice}>
              <RadioButton
                name={`${option.id}-choice`}
                value={choice.choiceHandle}
                defaultChecked={choice.isDefault}
                className={styles.radioButton}
                onClick={() => {
                  setOption({
                    ...option,
                    choiceList: option.choiceList.map((c, i) =>
                      i === idx
                        ? {
                            ...option.choiceList[i],
                            isDefault: true,
                          }
                        : {
                            ...option.choiceList[i],
                            isDefault: false,
                          }
                    ),
                  });
                }}
              />
              <InputField
                onBlur={(e) => {
                  if (e.target.value === "") {
                    e.target.value = choice.choiceHandle;
                    setAlertText("選択肢は必須です");
                    setAlertActive(true);
                    return;
                  }
                  setOption({
                    ...option,
                    choiceList: option.choiceList.map((c, i) =>
                      i === idx
                        ? {
                            ...option.choiceList[i],
                            choiceHandle: e.target.value,
                            choiceName: e.target.value,
                          }
                        : c
                    ),
                  });
                }}
                defaultVal={choice.choiceHandle}
                className={styles.choiceHandle}
              />
              <div className={styles.price}>
                <InputField
                  type="number"
                  defaultVal={choice.priceDiff.toString()}
                  onBlur={(e) => {
                    setOption({
                      ...option,
                      choiceList: option.choiceList.map((c, i) =>
                        i === idx
                          ? {
                              ...option.choiceList[i],
                              priceDiff: parseInt(e.target.value),
                            }
                          : c
                      ),
                    });
                  }}
                />
                円
              </div>
              <div
                className={[styles.icon, styles.delete].join(" ")}
                onClick={() => {
                  setOption({
                    ...option,
                    choiceList: option.choiceList.filter((c, i) => i !== idx),
                  });
                }}
              >
                <Icon path={mdiTrashCanOutline} />
              </div>
            </div>
          ))}
          <div className={[styles.choice, styles.add].join(" ")}>
            <div className={styles.radioButton}></div>
            <InputField
              ref={addContentHandleRef}
              className={styles.choiceHandle}
              placeHolder="名前を入力"
              onChange={(e) => {
                setAddContentHandle(e.target.value);
              }}
            />
            <div className={styles.price}>
              <InputField
                ref={addCotnentPriceRef}
                placeHolder="価格を入力"
                onBlur={(e) => {
                  const num = parseInt(e.target.value);
                  if (isNaN(num)) {
                    e.target.value = "";
                    setAlertText("価格は整数で入力してください");
                    setAlertActive(true);
                    return;
                  }
                  setAddContentPrice(num);
                }}
                defaultVal={addContentPrice.toString()}
                type="number"
              />
              円
            </div>
            <div
              className={[
                styles.icon,
                styles.add,
                addContentHandle && addContentPrice !== null
                  ? null
                  : styles.disabled,
              ].join(" ")}
              onClick={(e) => {
                if (!addContentHandle || addContentPrice === null) {
                  return;
                }
                if (
                  option.choiceList
                    .map((c) => c.choiceHandle)
                    .includes(addContentHandle)
                ) {
                  setAlertText("同じ選択肢を2つ作ることはできません");
                  setAlertActive(true);
                  return;
                }
                setOption({
                  ...option,
                  choiceList: [
                    ...option.choiceList,
                    {
                      choiceHandle: addContentHandle,
                      choiceName: addContentHandle,
                      priceDiff: addContentPrice,
                      isDefault: false,
                      id: null,
                      index: option.choiceList.length,
                    },
                  ],
                });
                resetAdd();
              }}
            >
              <Icon path={mdiPlus} />
            </div>
          </div>
        </div>
      </div>
      <div className={[styles.buttons].join(" ")}>
        <div
          className={[styles.button, styles.delete].join(" ")}
          onClick={async () => {
            const yesno = confirm(
              "本当にこのオプションを削除しますか？この操作は戻せません"
            );
            if (!yesno) return;
            setDeleting(true);
            try {
              await jsonFetch(`/api/cafeteria/option`, "DELETE", {
                id: option.id,
              } as OptionDeleteBody);
              setOptions(options.filter((o) => o.id !== option.id));
            } catch {}
            setDeleting(false);
          }}
        >
          <TextWithLoadingIcon isLoading={deleting}>削除</TextWithLoadingIcon>
        </div>
        <div
          className={[
            styles.button,
            styles.cancel,
            isChanged ? styles.changed : "",
          ].join(" ")}
          onClick={() => {
            setOption(defaultOption);
          }}
        >
          キャンセル
        </div>
        <div
          className={[
            styles.button,
            styles.save,
            isChanged ? styles.changed : "",
          ].join(" ")}
          onClick={async () => {
            setSaving(true);
            try {
              const data: OptionPutBody = option as OptionPutBody;
              await jsonFetch("/api/cafeteria/option", "PUT", data);
              setOptions(options.map((o) => (o.id === option.id ? option : o)));
              resetAdd();
            } catch {}
            setSaving(false);
          }}
        >
          <TextWithLoadingIcon isLoading={saving}>保存</TextWithLoadingIcon>
        </div>
      </div>
      <Alert active={alertActive} setActive={setAlertActive}>
        <NormalAlertContainer>
          <div>{alertText}</div>
          <ModalButton
            label="OK"
            onClick={() => {
              setAlertActive(false);
            }}
          ></ModalButton>
        </NormalAlertContainer>
      </Alert>
    </div>
  );
};

export const CafeteriaOptionCardPlus: React.FC<{
  setOptions: React.Dispatch<React.SetStateAction<MenuOption[]>>;
  options: MenuOption[];
}> = ({ setOptions, options }) => {
  // TODO: 例外処理を追加
  const [adding, setAdding] = useState<boolean>(false);
  return (
    <div
      className={[
        styles.optionCardContainer,
        styles.addOptionCardContainer,
      ].join(" ")}
    >
      <div
        className={styles.icon}
        onClick={async () => {
          const newOption = {
            choiceList: [],
            id: null,
            index: options.length,
            optionHandle: "",
            optionName: "",
            choiceNum: 1,
            priority: 0,
            cafeteriaId: options[0].cafeteriaId,
          };
          setAdding(true);
          try {
            const res = await jsonFetch("/api/cafeteria/option", "POST", {
              newOption,
            } as OptionPostBody);
            const data = (await res.json()) as OptionPostResponse;
            if (data.code !== 200) {
              alert(data.message || "エラーが発生しました");
              throw new Error();
            }
            setOptions((prev) => [
              ...prev,
              {
                ...newOption,
                id: data.additionalData.option.id,
              },
            ]);
          } catch (e) {
            logger.debug(e);
          }
          setAdding(false);
        }}
      >
        {adding ? (
          <LoadingIcon className={styles.loadinIcon} />
        ) : (
          <Icon path={mdiPlusCircleOutline} />
        )}
      </div>
      <div className={styles.text}>あたらしいオプションを追加</div>
    </div>
  );
};
