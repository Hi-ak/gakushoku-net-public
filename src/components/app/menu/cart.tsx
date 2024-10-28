import type { PurchaseCartRequestDataBody } from "@/app/api/menu/purchase/cart/route";
import type {
  PaypayGetQRRequestBody,
  PaypayGetQRResponseBody,
} from "@/app/api/paypay/get-qr/route";
import styles from "@/common/styles/app/menu/cart.module.scss";
import { ClientCartTicket } from "@/common/types/cart";
import { totalPriceFromCart } from "@/common/utils/cart";
import { jsonFetch } from "@/common/utils/customFetch";
import { Payment } from "@/common/var/payment";
import { LoadingIcon } from "@/components/loading/loadingIcon";
import { mdiMinusBoxOutline, mdiPlusBoxOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import paypayButton from "@/paypay_button2.png";

export const CartComponent: React.FC<{
  setPage: React.Dispatch<React.SetStateAction<string>>;
  cart: ClientCartTicket[];
  setCart: React.Dispatch<React.SetStateAction<ClientCartTicket[]>>;
  cafeteriaId: string;
  userId: string;
}> = ({ setPage, cart, setCart, cafeteriaId, userId }) => {
  const [payment, setPayment] = useState<Payment>("PAYPAY");
  const [buying, setBuying] = useState(false);
  const router = useRouter();

  useEffect(() => {}, [payment]);

  return (
    <div className={styles.cart}>
      <form className={styles.cartForm}>
        <h2>注文内容</h2>
        <div className={styles.cartContents}>
          <ul className={styles.contents}>
            {cart.map((cartTicket, cartIdx) => {
              const itemPrice = cartTicket.options.reduce(
                (acc, option) => acc + option.priceDiff,
                cartTicket.menuPrice
              );
              return (
                <li key={cartTicket.tempId} id={cartTicket.tempId}>
                  <div className={styles.cartItem}>
                    <div className={styles.itemName}>
                      {cartTicket.menuTitle}
                    </div>
                    <ul className={styles.options}>
                      {cartTicket.options
                        .filter((option) => !option.isDefault)
                        .map((option, optionIdx) => (
                          <li key={option.optionHandle}>
                            {option.choiceName}
                            {`${option.priceDiff >= 0 ? "+" : "-"}${
                              option.priceDiff
                            }円`}
                            <div
                              className={styles.iconMinus}
                              onClick={() => {
                                setCart((prevCart) => {
                                  const newCartTicket = {
                                    ...cartTicket,
                                    options: cartTicket.options.filter(
                                      (_, idx) => idx !== optionIdx
                                    ),
                                  };
                                  prevCart.splice(cartIdx, 1, newCartTicket);
                                  return [...prevCart];
                                });
                              }}
                            >
                              <Icon path={mdiMinusBoxOutline}></Icon>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className={styles.itemPrice}>
                    <p>{itemPrice}円</p>
                  </div>
                  <div className={styles.quantity}>
                    <p>x{cartTicket.quantity}</p>
                  </div>
                  <div className={styles.sumPrice}>
                    <p>{itemPrice * cartTicket.quantity}円</p>
                  </div>
                  <div className={styles.changeQuantity}>
                    <div
                      className={styles.minus}
                      onClick={() => {
                        if (cartTicket.quantity <= 1) {
                          setCart((prevCart) =>
                            prevCart.filter((_, idx) => idx !== cartIdx)
                          );
                          return;
                        }
                        setCart((prevCart) => {
                          prevCart.splice(cartIdx, 1, {
                            ...cartTicket,
                            quantity: cartTicket.quantity - 1,
                          });
                          return [...prevCart];
                        });
                      }}
                    >
                      <Icon path={mdiMinusBoxOutline}></Icon>
                    </div>
                    <div
                      className={styles.plus}
                      onClick={() => {
                        setCart((prevCart) => {
                          prevCart.splice(cartIdx, 1, {
                            ...cartTicket,
                            quantity: cartTicket.quantity + 1,
                          });
                          return [...prevCart];
                        });
                      }}
                    >
                      <Icon path={mdiPlusBoxOutline}></Icon>
                    </div>
                  </div>
                </li>
              );
            })}
            <div className={styles.bar}></div>
            <li>
              <div className={styles.cartItem}>合計</div>
              <div className={styles.itemPrice}></div>
              <div className={styles.quantity}></div>
              <div className={styles.sumPrice}>
                {cart.reduce((acc, cartTicket) => {
                  const itemPrice = cartTicket.options.reduce(
                    (acc, option) => acc + option.priceDiff,
                    cartTicket.menuPrice
                  );
                  return acc + itemPrice * cartTicket.quantity;
                }, 0)}
                円
              </div>
              <div className={styles.changeQuantity}></div>
            </li>
          </ul>
        </div>
        {/*
        <h2>決済方法を選択</h2>
        <div className={styles.payments}>
          {payments.map((payment) => (
            <label
              key={payment}
              className={styles.payment}
              onClick={() => {
                setPayment(payment);
              }}
            >
              <input type="radio" name="payment" value={payment} />
              {PaymentsNodes[payment]}
            </label>
          ))}
        </div>
        <div className={styles.span}></div>
              */}
        <div className={styles.buttons}>
          {/* この下のdivをbuttonにすると動かなくなる */}
          <div
            className={[styles.button, styles.buy, "relative"].join(" ")}
            onClick={async () => {
              if (buying) return;
              setBuying(true);
              try {
                setPayment("PAYPAY");
                /*
                if (!payment) {
                  alert("決済方法を選択してください。");
                  return;
                }
                */
                const res = await jsonFetch<PaypayGetQRRequestBody>(
                  "/api/paypay/get-qr",
                  "POST",
                  {
                    amount: totalPriceFromCart(cart).toString(),
                    userAgent: navigator.userAgent,
                    hostname: `${location.protocol}//${location.hostname}${
                      ["80", "443"].includes(location.port)
                        ? ""
                        : `:${location.port}`
                    }`,
                  } as PaypayGetQRRequestBody
                );
                const paypayData: PaypayGetQRResponseBody = await res.json();
                await jsonFetch<PurchaseCartRequestDataBody>(
                  "/api/menu/purchase/cart",
                  "POST",
                  {
                    merchantPaymentId: paypayData.merchantPaymentId,
                    cart,
                    cafeteriaId,
                    userId,
                  }
                );

                router.push(paypayData.additionalData.BODY.data.url);
              } finally {
                setBuying(false);
              }
            }}
          >
            {buying ? (
              <LoadingIcon />
            ) : (
              <Image priority alt="PayPay でお支払い" src={paypayButton} />
            )}
          </div>
          <div
            className={[styles.button, styles.return].join(" ")}
            onClick={() => {
              setPage("menu");
            }}
          >
            戻る
          </div>
        </div>
      </form>
    </div>
  );
};
