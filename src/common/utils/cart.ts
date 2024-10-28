import { ClientCartTicket } from "../types/cart";
import { Ticket } from "../types/ticket";

export interface CartTotalAmount {
  quantity: number;
}

export interface CartTotalPrice {
  options: {
    priceDiff: number;
  }[];
  menuPrice: number;
  quantity: number;
}

export const totalAmountFromCart = (cart: CartTotalAmount[]) => {
  return cart.reduce((acc, cartTicket) => acc + cartTicket.quantity, 0);
};

export const totalPriceFromCart = (cart: CartTotalPrice[]) => {
  return cart.reduce((acc, cartTicket) => {
    const itemPrice = cartTicket.options.reduce(
      (acc, option) => acc + option.priceDiff,
      cartTicket.menuPrice
    );
    return acc + itemPrice * cartTicket.quantity;
  }, 0);
};

interface TicketOptionForCalcPrice {
  choicePrice: number;
}

interface TicketForCalcPrice {
  menuPrice: number;
  options: TicketOptionForCalcPrice[];
}

export const totalPriceFromTickets = (tickets: TicketForCalcPrice[]) => {
  return tickets.reduce((acc, ticket) => {
    const itemPrice = ticket.options.reduce(
      (acc, option) => acc + option.choicePrice,
      ticket.menuPrice
    );
    return acc + itemPrice;
  }, 0);
};
