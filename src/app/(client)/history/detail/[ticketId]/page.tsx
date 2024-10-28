import { NextPage } from "next";
import { HistoryDetailPageComponent } from "./historyDetail";
import { prisma } from "@/common/utils/prisma";
import { TicketStatus } from "@prisma/client";
import { totalPriceFromCart } from "@/common/utils/cart";

export interface HistoryDetailTicket {
  id: string;
  menuTitle: string;
  menuPrice: number;
  totalPrice: number;
  options: {
    choiceName: string;
    choiceHandle: string;
    priceDiff: number;
    isDefault: boolean;
  }[];
  sameReceiptTickets: { id: string; status: TicketStatus; menuTitle: string }[];
  status: TicketStatus;
  createdAt: Date;
  paymentId: string;
}

const HistoryDetailPage: NextPage<{ params: { ticketId } }> = async ({
  params,
}) => {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: params.ticketId,
    },
    select: {
      id: true,
      menuRelation: {
        select: {
          title: true,
          price: true,
        },
      },
      options: {
        select: {
          choiceRelation: {
            select: {
              choiceName: true,
              choiceHandle: true,
              priceDiff: true,
              isDefault: true,
            },
          },
          ticketId: true,
        },
      },
      receiptRelation: {
        select: {
          tickets: {
            select: {
              menuRelation: {
                select: {
                  title: true,
                },
              },
              id: true,
              status: true,
            },
          },
          paymentId: true,
        },
      },
      status: true,
      createdAt: true,
    },
  });
  const formedData: HistoryDetailTicket = {
    id: ticket.id,
    menuTitle: ticket.menuRelation.title,
    menuPrice: ticket.menuRelation.price,
    totalPrice: totalPriceFromCart([
      {
        options: ticket.options.map((option) => ({
          priceDiff: option.choiceRelation.priceDiff,
        })),
        menuPrice: ticket.menuRelation.price,
        quantity: 1,
      },
    ]),
    options: ticket.options.map((option) => ({
      choiceName: option.choiceRelation.choiceName,
      choiceHandle: option.choiceRelation.choiceHandle,
      priceDiff: option.choiceRelation.priceDiff,
      isDefault: option.choiceRelation.isDefault,
    })),
    sameReceiptTickets: ticket.receiptRelation.tickets.map((ticket) => ({
      id: ticket.id,
      status: ticket.status,
      menuTitle: ticket.menuRelation.title,
    })),
    status: ticket.status,
    createdAt: ticket.createdAt,
    paymentId: ticket.receiptRelation.paymentId,
  };
  return <HistoryDetailPageComponent ticketData={formedData} />;
};

export default HistoryDetailPage;
