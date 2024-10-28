import { ReactNode } from "react";

export const payments = ["PAYPAY"] as const;
export type Payment = (typeof payments)[number];
export const PaymentsNodes: { [key in Payment]: ReactNode } = {
  PAYPAY: <span>PayPay</span>,
};
