"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/common/styles/components/cards/menuCard.module.scss";
import editStyles from "@/common/styles/components/cards/cafeteriaMenuCard.module.scss";
import { Menu, MenuOption, OptionChoice } from "@/common/types/menu";
import { CardButton } from "./cardButton";
import { Modal } from "../modals/modal";
import { CartTicket, ClientCartTicket } from "@/common/types/cart";
import { InputField } from "../inputs/inputField";
import { MenuCategory } from "@/common/types/menu";
import Icon from "@mdi/react";
import {
  mdiPlusCircle,
  mdiPlusCircleOutline,
  mdiTrashCan,
  mdiTrashCanOutline,
} from "@mdi/js";
import { checkPrime } from "crypto";
import { Alert, ConfirmAlert } from "../modals/alert";
import { ModalButton } from "./modalButton";
import { NormalAlertContainer } from "../modals/ui";
import { jsonFetch } from "@/common/utils/customFetch";
import { MenuPostResponse } from "@/app/api/cafeteria/menu/route";
import { MenuOption as PrismaMenuOption } from "@prisma/client";
import { LoadingIcon } from "../loading/loadingIcon";
import { TextWithLoadingIcon } from "../loading/textWithLoadingIcon";
import { CheckBox } from "../inputs/checkBox";

// /cafeteria/menu/listで表示されるカードのcomponent
const Choice: React.FC<{
  option: MenuOption;
  choice: OptionChoice;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  idx: number;
}> = ({ option, choice, setValue, idx }) => {
  const parentRef = React.useRef<HTMLLabelElement>(null);
  return (
    <React.Fragment key={choice.choiceHandle}>
      <label
        ref={parentRef}
        htmlFor={`${option.optionHandle}-${choice.choiceHandle}`}
        className={styles.choiceContainer}
      >
        <div className={styles.choice}>
          <input
            type="radio"
            name={option.optionHandle}
            id={`${option.optionHandle}-${choice.choiceHandle}`}
            defaultChecked={choice.isDefault}
            onClick={(e) => {
              setValue(e.currentTarget.value);
              parentRef.current?.animate(
                [
                  {
                    transform: "scale(1)",
                  },
                  {
                    transform: "scale(1.1)",
                  },
                  {
                    transform: "scale(1)",
                  },
                ],
                {
                  duration: 300,
                  easing: "ease",
                }
              );
            }}
            value={choice.choiceHandle}
          />
          <div className={styles.name}>{choice.choiceName}</div>
          {choice.priceDiff !== 0 && (
            <div className={styles.priceDiff}>
              {choice.priceDiff > 0 ? "+" : "-"}
              {choice.priceDiff}円
            </div>
          )}
        </div>
      </label>
      {idx !== option.choiceList.length - 1 && (
        <div className={styles.part}></div>
      )}
    </React.Fragment>
  );
};

const Option: React.FC<{
  option: MenuOption;
  setCartTicket: React.Dispatch<React.SetStateAction<ClientCartTicket>>;
}> = ({ option, setCartTicket }) => {
  const [value, setValue] = useState<string>(
    option.choiceList.find((choice) => choice.isDefault).choiceHandle
  );
  useEffect(() => {
    setCartTicket((cartTicket) => ({
      ...cartTicket,
      options: cartTicket.options.map((cartOption) => {
        if (cartOption.optionHandle === option.optionHandle) {
          const idx = option.choiceList.findIndex(
            (choice) => choice.choiceHandle === value
          );
          return {
            ...cartOption,
            isDefault: option.choiceList[idx].isDefault,
            choiceName: option.choiceList[idx].choiceName,
            priceDiff: option.choiceList[idx].priceDiff,
            choiceHandle: value,
          };
        }
        return cartOption;
      }),
    }));
  }, [option, setCartTicket, value]);
  return (
    <div className={styles.option} key={option.optionHandle}>
      {option.choiceList.map((choice, idx) => (
        <Choice
          key={choice.choiceHandle}
          option={option}
          choice={choice}
          setValue={setValue}
          idx={idx}
        />
      ))}
    </div>
  );
};

/**
 * メニューで表示する食券のコンポーネント
 */
export const CafeteriaMenuCard: React.FC<{
  idx: number;
  menu: Menu;
  setMenus: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  options: PrismaMenuOption[];
  defaultModalActive?: boolean;
}> = ({
  menu: defaultMenu,
  idx,
  setMenus,
  options,
  defaultModalActive = false,
}) => {
  const [modalActive, setModalActive] = useState(false);
  const [addContent, setAddContent] = useState<string>("");
  const addContentRef = useRef<HTMLInputElement>(null);
  const [addOption, setAddOption] = useState<string>("default");
  const addOptionRef = useRef<HTMLSelectElement>(null);
  const [menu, setMenu] = useState<Menu>(defaultMenu);
  const [alertText, setAlertText] = useState<string>("");
  const [alertActive, setAlertActive] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const resetAdds = () => {
    setAddContent("");
    addContentRef.current.value = "";
    setAddOption("default");
    addOptionRef.current.value = "default";
  };
  const backgroundStyle = {
    backgroundImage: `url(${defaultMenu.backgroundImageURL})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundBlendMode: "lighten",
    backgroundColor: defaultMenu.backgroundImageURL
      ? "#ffe0bbbb"
      : "var(--background-color)",
  };
  useEffect(() => {
    setModalActive(defaultModalActive);
  }, [setModalActive, defaultModalActive]);

  const unusedOptions = [...options];
  menu.options.forEach((option) => {
    const idx = unusedOptions.findIndex(
      (unusedOption) => unusedOption.optionHandle === option.optionHandle
    );
    if (idx !== -1) {
      unusedOptions.splice(idx, 1);
    }
  });

  return (
    <div className={styles.cardContainer} style={backgroundStyle}>
      <div className={styles.titleAndPrice}>
        <h2 className={styles.title}>{defaultMenu.title}</h2>
        <div className={styles.price}>{defaultMenu.price}円</div>
      </div>
      <ul className={styles.contents}>
        {menu.serviceStatus === "UNAVAILABLE" ? <li>提供停止中</li> : null}
        {defaultMenu.contents.map((content) => (
          <li key={content}>{content}</li>
        ))}
      </ul>
      <div className={editStyles.cardButtons}>
        <CardButton
          onClick={() => {
            setModalActive(true);
          }}
        />
        <CardButton
          className={editStyles.delete}
          onClick={async () => {
            const yesno = confirm(
              "本当にこのメニューを削除しますか？この操作は戻せません"
            );
            if (!yesno) return;
            setDeleting(true);
            await jsonFetch("/api/cafeteria/menu", "DELETE", {
              id: defaultMenu.id,
            });
            setMenus((menus) =>
              menus.map((category) => ({
                ...category,
                menus: category.menus.filter((m) => m.id !== defaultMenu.id),
              }))
            );
          }}
        >
          <TextWithLoadingIcon isLoading={deleting}>削除</TextWithLoadingIcon>
        </CardButton>
      </div>
      <Modal active={modalActive} setActive={setModalActive}>
        <div className={[editStyles.modalContainer].join(" ")}>
          <div className={editStyles.headline}>
            <div className={editStyles.title}>
              <InputField
                className={editStyles.titleInput}
                defaultVal={defaultMenu.title}
                onBlur={(e) => {
                  if (e.currentTarget.value === "") {
                    e.currentTarget.value = defaultMenu.title;
                    setAlertText("タイトルを空にすることはできません");
                    setAlertActive(true);
                    return;
                  }
                  setMenu((menu) => ({
                    ...menu,
                    title: e.target.value,
                  }));
                }}
              />
            </div>
            <div className={editStyles.priceContainer}>
              価格:
              <InputField
                type={"number"}
                className={editStyles.headlineInput}
                defaultVal={defaultMenu.price.toString()}
                onBlur={(e) => {
                  if (e.currentTarget.value === "") {
                    e.currentTarget.value = defaultMenu.price.toString();
                    setAlertText("価格を空にすることはできません");
                    setAlertActive(true);
                    return;
                  }
                  setMenu((menu) => ({
                    ...menu,
                    price: parseInt(e.target.value),
                  }));
                }}
              />
              円
            </div>
            <div className={editStyles.isDaily}>
              <CheckBox
                name="isDaily"
                id={"isDaily" + menu.id}
                className={editStyles.isDailyCheckBox}
                defaultChecked={menu.isDaily}
                onClick={(e) => {
                  const target = e.currentTarget;
                  setMenu((menu) => ({
                    ...menu,
                    isDaily: target.checked,
                  }));
                }}
              />
              <label htmlFor={"isDaily" + menu.id}>日替わり</label>
            </div>
            <div className={editStyles.isDaily}>
              <CheckBox
                name="isNotAvailable"
                className={editStyles.isDailyCheckBox}
                id={"isNotAvailable" + menu.id}
                defaultChecked={menu.serviceStatus === "UNAVAILABLE"}
                onClick={(e) => {
                  const target = e.currentTarget;
                  setMenu((menu) => ({
                    ...menu,
                    serviceStatus: target.checked
                      ? "UNAVAILABLE"
                      : defaultMenu.serviceStatus === "UNAVAILABLE"
                      ? "AVAILABLE"
                      : defaultMenu.serviceStatus,
                  }));
                }}
              />
              <label htmlFor={"isNotAvailable" + menu.id}>提供停止</label>
            </div>
          </div>
          <div className={editStyles.contentsAndOptions}>
            <div className={editStyles.contentsContainer}>
              <p>メニューの内容</p>
              <div className={editStyles.contents}>
                {menu.contents.map((content, idx) => (
                  <div key={content} className={editStyles.content}>
                    <InputField
                      className={editStyles.contentInput}
                      defaultVal={content}
                      onBlur={(e) => {
                        if (e.currentTarget.value === "") {
                          e.currentTarget.value = content;
                          setAlertText("内容を空にすることはできません");
                          setAlertActive(true);
                          return;
                        }
                        setMenu((menu) => {
                          const newContents = [...menu.contents];
                          newContents[idx] = e.target.value;
                          return {
                            ...menu,
                            contents: newContents,
                          };
                        });
                      }}
                    />
                    <div
                      className={[editStyles.delete, editStyles.icon].join(" ")}
                      onClick={() => {
                        setMenu((menu) => ({
                          ...menu,
                          contents: menu.contents.filter((c) => c !== content),
                        }));
                      }}
                    >
                      <Icon path={mdiTrashCanOutline} />
                    </div>
                  </div>
                ))}
                <div className={editStyles.content}>
                  <InputField
                    ref={addContentRef}
                    id="addContentInput"
                    className={editStyles.contentInput}
                    placeHolder="内容を入力"
                    onChange={(e) => {
                      setAddContent(e.currentTarget.value);
                    }}
                  />
                  <div
                    className={[
                      editStyles.add,
                      editStyles.icon,
                      !addContent ? editStyles.disabled : null,
                    ].join(" ")}
                    onClick={async () => {
                      if (menu.contents.includes(addContent)) {
                        setAlertText("同じ内容は追加できません");
                        setAlertActive(true);
                        resetAdds();
                        return;
                      }
                      if (!addContent) return;
                      setMenu((menu) => ({
                        ...menu,
                        contents: [...menu.contents, addContent],
                      }));
                      resetAdds();
                    }}
                  >
                    <Icon path={mdiPlusCircleOutline} />
                  </div>
                </div>
              </div>
            </div>
            <div className={editStyles.optionsContainer}>
              <p>オプション</p>
              <div className={editStyles.options}>
                {menu.options.map((option) => (
                  <div key={option.optionHandle} className={editStyles.option}>
                    <select
                      name={option.optionHandle}
                      id={`option-${option.optionHandle}`}
                      defaultValue={option.optionHandle}
                      onChange={(e) => {
                        setMenu((menu) => ({
                          ...menu,
                          options: menu.options.splice(
                            menu.options.findIndex(
                              (o) => o.optionHandle === option.optionHandle
                            ),
                            1,
                            {
                              optionHandle: e.target.value,
                              optionName: e.target.value,
                              choiceNum: unusedOptions.find(
                                (o) => o.optionHandle === e.target.value
                              ).choiceNum,
                            }
                          ),
                        }));
                      }}
                    >
                      <option value={option.optionHandle}>
                        {option.optionName}
                      </option>
                      {unusedOptions.map((o) => (
                        <option key={o.optionHandle} value={o.optionHandle}>
                          {o.optionName}
                        </option>
                      ))}
                    </select>
                    <div
                      className={[editStyles.icon, editStyles.delete].join(" ")}
                      onClick={() => {
                        setMenu((menu) => ({
                          ...menu,
                          options: menu.options.filter(
                            (o) => o.optionHandle !== option.optionHandle
                          ),
                        }));
                      }}
                    >
                      <Icon path={mdiTrashCanOutline} />
                    </div>
                  </div>
                ))}
                <div className={[editStyles.option, editStyles.add].join(" ")}>
                  <select
                    name="addOption"
                    id="addOption"
                    defaultValue="default"
                    ref={addOptionRef}
                    onChange={(e) => {
                      setAddOption(e.currentTarget.value);
                    }}
                  >
                    <option value="default">&lt;オプションを選択&gt;</option>
                    {unusedOptions.map((option) => (
                      <option
                        key={option.optionHandle}
                        value={option.optionHandle}
                      >
                        {option.optionName}
                      </option>
                    ))}
                  </select>
                  <div
                    className={[
                      editStyles.icon,
                      editStyles.add,
                      addOption === "default" ? editStyles.disabled : null,
                    ].join(" ")}
                    onClick={async () => {
                      if (addOption === "default") return;
                      setMenu((menu) => ({
                        ...menu,
                        options: [
                          ...menu.options,
                          {
                            optionHandle: addOption,
                            optionName: addOption,
                            choiceNum: unusedOptions.find(
                              (o) => o.optionHandle === addOption
                            ).choiceNum,
                          },
                        ],
                      }));
                      resetAdds();
                    }}
                  >
                    <Icon path={mdiPlusCircleOutline} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={editStyles.buttons}>
            <div
              className={[editStyles.button, editStyles.cancel].join(" ")}
              onClick={() => {
                setModalActive(false);
                setMenu(defaultMenu);
                resetAdds();
              }}
            >
              キャンセル
            </div>
            <div
              className={[editStyles.button, editStyles.save].join(" ")}
              onClick={async () => {
                setSaving(true);
                try {
                  await jsonFetch("/api/cafeteria/menu", "PUT", menu);
                  setMenus((menus) =>
                    menus.map((category) => ({
                      ...category,
                      menus: category.menus.map((m) =>
                        m.id === menu.id ? menu : m
                      ),
                    }))
                  );
                  setModalActive(false);
                  resetAdds();
                } catch {}
                setSaving(false);
              }}
            >
              <TextWithLoadingIcon isLoading={saving}>
                変更を保存
              </TextWithLoadingIcon>
            </div>
          </div>
        </div>
      </Modal>
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
      <ConfirmAlert active={false} setActive={() => {}} onConfirm={() => {}}>
        本当にこのメニューを削除しますか？この操作は戻せません・
      </ConfirmAlert>
    </div>
  );
};

export const CafeteriaMenuCardPlus: React.FC<{
  setMenus: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  category: string;
  cafeteriaId: string;
  setAdded: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setMenus, category, cafeteriaId, setAdded }) => {
  // TODO: 例外処理を追加
  const [adding, setAdding] = useState<boolean>(false);
  return (
    <div className={[styles.cardContainer, styles.addCardContainer].join(" ")}>
      <div
        className={styles.icon}
        onClick={async () => {
          const newMenu: Menu = {
            id: null,
            title: "新しいメニュー",
            price: 0,
            availableQuantity: 0,
            defaultQuantity: 0,
            contents: [],
            options: [],
            categoryHandle: category,
            backgroundImageURL: "",
            cafeteriaId: cafeteriaId,
            serviceStatus: "AVAILABLE",
            isDaily: false,
          };
          if (adding) return;
          setAdding(true);
          try {
            const res = await jsonFetch("/api/cafeteria/menu", "POST", {
              newMenu,
            });
            const data = (await res.json()) as MenuPostResponse;
            newMenu.id = data.additionalData.menu.id;
            setMenus((menus) => {
              return menus.map((menuCategory) => {
                if (menuCategory.categoryHandle === category) {
                  return {
                    ...menuCategory,
                    menus: [...menuCategory.menus, newMenu],
                  };
                }
                return menuCategory;
              });
            });
            setAdded(newMenu.id);
          } catch (e) {}
          setAdding(false);
        }}
      >
        {adding ? <LoadingIcon /> : <Icon path={mdiPlusCircleOutline}></Icon>}
      </div>
      <div className={styles.addText}>メニューを追加</div>
    </div>
  );
};
