import { TicketStatus } from "@prisma/client";
import { Menu, MenuOption, OptionChoice } from "./menu";

export interface TicketOption {
  id?: string;
  optionId?: string;
  choiceId?: string;
  choicePrice?: number;
  choiceRelation?: OptionChoice;
  optionRelation?: MenuOption;
  ticketId?: string;
}

export interface Ticket {
  id?: string;
  holderId?: string;
  receiptId?: string;
  orderId?: string;
  menuId?: string;
  menuPrice?: number;
  menuRelation?: Menu;
  options?: TicketOption[];
  createdAt?: Date;
  updatedAt?: Date;
  status?: TicketStatus;
}

export const localizedTicketStatus: { [key in TicketStatus]: string } = {
  REFUNDED: "返金済",
  UNUSED: "未使用",
  ORDERED: "注文中",
  USED: "使用済",
};

export const tickeStatusColorBind: { [key in TicketStatus]: string } = {
  UNUSED: "green",
  USED: "gray",
  ORDERED: "red",
  REFUNDED: "gray",
};
