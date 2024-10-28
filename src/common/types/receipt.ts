import { Menu, OptionChoice } from "./menu";
import { User } from "./user";
import { Ticket } from "./ticket";
import { Cafeteria } from "@prisma/client";
// import { PaymentTypes } from "@prisma/client";

export interface Receipt {
  id?: string;
  issuerId?: string;
  issuerRelation?: Cafeteria;
  userId?: string;
  recipientRelation?: User;
  tickets?: Ticket[];
  totalAmount?: number; //購入点数
  totalPrice?: number;
  // paymentType?: PAYPAY しか存在しない
  taxRate?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
