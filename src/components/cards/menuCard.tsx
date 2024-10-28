"use client";
import React, { useEffect, useState } from "react";
import styles from "@/common/styles/components/cards/menuCard.module.scss";
import { Menu, MenuOption, OptionChoice } from "@/common/types/menu";
import { CardButton } from "./cardButton";
import { SmallModal } from "../modals/modal";
import Icon from "@mdi/react";
import { mdiMenuLeft, mdiMenuRight } from "@mdi/js";
import { CartTicket, ClientCartTicket } from "@/common/types/cart";
import { ModalButton } from "./modalButton";
import shortUUID from "short-uuid";
import { ServiceStatus } from "@prisma/client";

const Choice: React.FC<{
  menuId: string;
  option: MenuOption;
  choice: OptionChoice;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  idx: number;
}> = ({ menuId, option, choice, setValue, idx }) => {
  const parentRef = React.useRef<HTMLLabelElement>(null);
  return (
    <React.Fragment key={choice.choiceHandle}>
      <label ref={parentRef} className={styles.choiceContainer}>
        <div className={styles.choice}>
          <input
            type="radio"
            name={`${menuId}-${option.optionHandle}`}
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
  menuId: string;
  option: MenuOption;
  setCartTicket: React.Dispatch<React.SetStateAction<ClientCartTicket>>;
}> = ({ menuId, option, setCartTicket }) => {
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
          menuId={menuId}
        />
      ))}
    </div>
  );
};

/**
 * メニューで表示する食券のコンポーネント
 */
export const MenuCard: React.FC<{
  menu: Menu;
  setCart: React.Dispatch<React.SetStateAction<CartTicket[]>>;
}> = ({ menu, setCart }) => {
  const [modalActive, setModalActive] = React.useState(false);
  const [cartTicket, setCartTicket] = React.useState<ClientCartTicket>({
    tempId: shortUUID.generate(),
    menuId: menu.id,
    menuPrice: menu.price,
    menuTitle: menu.title,
    userId: "test",
    quantity: 1,
    options: menu.options.map((option) => {
      const idx = option.choiceList.findIndex((choice) => choice.isDefault);
      return {
        optionHandle: option.optionHandle,
        choiceHandle: option.choiceList[idx].choiceHandle,
        choiceName: option.choiceList[idx].choiceName,
        priceDiff: option.choiceList[idx].priceDiff,
        isDefault: true,
      };
    }),
  });
  const backgroundStyle = {
    backgroundImage: `url(${menu.backgroundImageURL})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundBlendMode: "lighten",
    backgroundColor: menu.backgroundImageURL
      ? "#ffe0bbbb"
      : "var(--background-color)",
  };
  useEffect(() => {}, [cartTicket]);
  return (
    <div className={styles.cardContainer} style={backgroundStyle}>
      <div className={styles.titleAndPrice}>
        <h2 className={styles.title}>{menu.title}</h2>
        <div className={styles.price}>{menu.price}円</div>
      </div>
      <ul className={styles.contents}>
        {menu.contents.map((content) => (
          <li key={content}>{content}</li>
        ))}
      </ul>
      {menu.serviceStatus == ServiceStatus.AVAILABLE ? (
        <CardButton
          onClick={() => {
            setModalActive(true);
          }}
        />
      ) : (
        <></>
      )}

      <SmallModal active={modalActive} setActive={setModalActive}>
        <div
          className={[styles.cardContainer, styles.modalCardContainer].join(
            " "
          )}
          style={backgroundStyle}
        >
          <div className={styles.titleAndPrice}>
            <h2 className={styles.title}>{menu.title}</h2>
          </div>
          <div className={styles.contentsContainer}>
            <ul className={styles.contents}>
              {menu.contents.map((content) => (
                <li key={content}>{content}</li>
              ))}
            </ul>
          </div>
          {menu.options?.length ? <h2>オプションを選択</h2> : null}
          <div className={styles.options}>
            {menu.options?.map((option) => (
              <Option
                key={option.optionHandle}
                option={option}
                setCartTicket={setCartTicket}
                menuId={menu.id}
              />
            ))}
          </div>
          <div className={styles.price}>
            {(menu.price +
              menu.options.reduce(
                (prev, curr) =>
                  prev +
                  curr.choiceList.find(
                    (choice) =>
                      choice.choiceHandle ===
                      cartTicket.options.find(
                        (option) => option.optionHandle === curr.optionHandle
                      ).choiceHandle
                  ).priceDiff,
                0
              )) *
              cartTicket.quantity}
            円
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.amountContainer}>
              <div
                className={styles.svg}
                onClick={() => {
                  if (cartTicket.quantity > 0) {
                    setCartTicket((cartTicket) => ({
                      ...cartTicket,
                      quantity: cartTicket.quantity - 1,
                    }));
                  }
                }}
              >
                <Icon path={mdiMenuLeft} />
              </div>
              <div className={styles.amount}>{cartTicket.quantity}</div>
              <div
                className={styles.svg}
                onClick={() => {
                  setCartTicket((cartTicket) => ({
                    ...cartTicket,
                    quantity: cartTicket.quantity + 1,
                  }));
                }}
              >
                <Icon path={mdiMenuRight} />
              </div>
            </div>
            <ModalButton
              onClick={() => {
                setTimeout(() => {
                  setCart((cart) => [...cart, cartTicket]);
                }, 300);
                setModalActive(false);
              }}
              className={[styles.buttonContainer, styles.modalButton].join(" ")}
            />
          </div>
        </div>
      </SmallModal>

      {menu.serviceStatus == ServiceStatus.AVAILABLE ? (
        <></>
      ) : (
        <div className={styles.soldOutScreen}>
          <h3>売り切れ</h3>
        </div>
      )}
    </div>
  );
};
