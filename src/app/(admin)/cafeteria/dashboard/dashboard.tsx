"use client";

import { totalPriceFromTickets } from "@/common/utils/cart";
import { getTime } from "@/common/utils/datetime";
import { getTicketNameWithOption } from "@/common/utils/ticketName";
import { toZonedTime } from "date-fns-tz";
import { useRouter } from "next/navigation";
import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
} from "react";

const Box: React.FC<
  DetailedHTMLProps<InputHTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
  const { children, className } = props;
  return (
    <div {...props} className={["shadow-lg", className].join(" ")}>
      {children}
    </div>
  );
};

interface SummaryProps {
  todayTotalPrice: number;
  todayToRefund: number;
  yesterdaySum: number;
}

const SummaryWrapper = (props) => {
  return (
    <div
      className={[
        "flex flex-col justify-center items-center",
        props.className,
      ].join(" ")}
    >
      {props.children}
    </div>
  );
};
const SummaryContent = ({ children }) => {
  return <span className="text-2xl font-bold">{children}</span>;
};
const SummarySubtitle = ({ text }) => {
  return <span className="text-sm">{text}</span>;
};
const SummarySymbol = ({ text }) => {
  return <span className="text-4xl self-center mx-4">{text}</span>;
};

const Summary: React.FC<SummaryProps> = ({
  todayToRefund,
  todayTotalPrice,
  yesterdaySum,
}) => {
  return (
    <Box className="mt-10 h-[120px] text-[black] bg-primary/25 border-4 border-primary outline-primary/25 rounded-[25px] flex flex-row justify-around items-center px-16">
      <div className="flex flex-row grow-[3] bg-[white] justify-center text-[black] p-5 rounded-[15px]">
        <SummaryWrapper className="">
          <SummaryContent>{todayTotalPrice}円</SummaryContent>
          <SummarySubtitle text="本日の現時点の売り上げ" />
        </SummaryWrapper>
        <SummarySymbol text="-" />
        <SummaryWrapper className="self-end">
          <div>{todayToRefund}円</div>
          <div className="text-[10px]">未使用</div>
        </SummaryWrapper>
        <SummarySymbol text="=" />
        <SummaryWrapper>
          <SummaryContent>{todayTotalPrice - todayToRefund}円</SummaryContent>
          <SummarySubtitle text="予想最終売り上げ金額" />
        </SummaryWrapper>
      </div>
      <SummaryWrapper className="grow-[3]">
        <SummaryContent>{yesterdaySum}円</SummaryContent>
        <SummarySubtitle text="昨日の売り上げ" />
      </SummaryWrapper>
    </Box>
  );
};

const Panel: React.FC<{ children?: ReactNode; title: string }> = ({
  children,
  title,
}) => {
  return (
    <div className="flex flex-col border border-[gray]/35 bg-menuBackground rounded shadow-lg">
      <div>
        <h2 className="p-3 border-b border-[gray]/35">{title}</h2>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
};

const PanelContainer: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return <div className="flex flex-col gap-4 flex-1">{children}</div>;
};

interface Receipt5PanelProps {
  receiptCount: number;
  receiptTaken5: {
    totalPrice: number;
    createdAt: Date;
    paymentId: string;
    tickets: any[];
  }[];
}

const Receipt5Panel: React.FC<Receipt5PanelProps> = ({
  receiptTaken5,
  receiptCount,
}) => {
  return (
    <Panel title={`直近5件の購入（全${receiptCount}件）`}>
      <div className="flex flex-col">
        {receiptTaken5.map((receipt) => (
          <div
            key={receipt.paymentId}
            className="flex text-right rounded flex-row items-center justify-between px-1 py-3 font-mono hover:bg-primary/15"
          >
            <div className="basis-[min-content] text-xs">
              {receipt.paymentId}
            </div>
            <div className="flex-[2]">{receipt.totalPrice}円</div>
            <div className="flex-1">{receipt.tickets.length}枚</div>
            <div className="flex-[2]">{getTime(receipt.createdAt)}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

interface Ticket5PanelProps {
  ticketTaken5: {
    id: string;
    menuPrice: number;
    menuRelation: {
      title: string;
    };
    options: {
      choicePrice: number;
      choiceRelation: {
        choiceName: string;
        isDefault: boolean;
      };
    }[];
    createdAt: Date;
  }[];
}

const Ticket5Panel: React.FC<Ticket5PanelProps> = ({ ticketTaken5 }) => {
  return (
    <Panel title="直近5件の購入された食券">
      <div className="flex flex-col">
        {ticketTaken5.map((ticket) => (
          <div
            key={ticket.id}
            className="flex text-right rounded flex-row items-center justify-between px-1 py-3 font-mono hover:bg-primary/15 gap-5"
          >
            <div className="">{getTicketNameWithOption(ticket)}</div>
            <div className="flex-1">{totalPriceFromTickets([ticket])}円</div>
            <div className="">{getTime(ticket.createdAt)}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

interface Order5PanelProps {
  orderTaken5: {
    id: string;
    createdAt: Date;
    tickets: {
      menuPrice: number;
      menuRelation: {
        title: string;
      };
      options: {
        choicePrice: number;
        choiceRelation: {
          choiceName: string;
          isDefault: boolean;
        };
      }[];
    }[];
  }[];
  orderNum: number;
  orderedTicketNum: number;
}

const Order5Panel: React.FC<Order5PanelProps> = ({
  orderTaken5,
  orderNum,
  orderedTicketNum,
}) => {
  return (
    <Panel title={`直近5件の注文（全${orderNum}件${orderedTicketNum}食券）`}>
      <div className="flex flex-col">
        {orderTaken5.map((order) => (
          <div
            key={order.id}
            className="flex text-right rounded flex-row items-center justify-between px-1 py-3 font-mono hover:bg-primary/15 gap-5"
          >
            <div className="flex-1 text-left">
              {order.tickets.map((ticket) => (
                <div key={ticket.menuRelation.title}>
                  {getTicketNameWithOption(ticket)}
                </div>
              ))}
            </div>
            <div className="flex-1">
              {totalPriceFromTickets(order.tickets)}円
            </div>
            <div className="flex-1">{getTime(order.createdAt)}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export const DashboardPageContent: React.FC<
  SummaryProps & Receipt5PanelProps & Ticket5PanelProps & Order5PanelProps
> = ({
  todayToRefund,
  todayTotalPrice,
  yesterdaySum,
  receiptTaken5,
  ticketTaken5,
  receiptCount,
  orderTaken5,
  orderNum,
  orderedTicketNum,
}) => {
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  });
  return (
    <div className="flex flex-col px-10 pb-10 gap-14">
      <Summary
        {...{
          todayToRefund,
          todayTotalPrice,
          yesterdaySum,
        }}
      />
      <div className="flex flex-row gap-4">
        <PanelContainer>
          <Receipt5Panel
            receiptTaken5={receiptTaken5}
            receiptCount={receiptCount}
          />
          <Order5Panel
            orderTaken5={orderTaken5}
            orderNum={orderNum}
            orderedTicketNum={orderedTicketNum}
          />
        </PanelContainer>
        <PanelContainer>
          <Ticket5Panel ticketTaken5={ticketTaken5} />
        </PanelContainer>
      </div>
    </div>
  );
};
