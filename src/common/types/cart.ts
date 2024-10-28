export interface CartTicket {
  id?: string;
  userId: string;
  menuId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
  options: {
    optionHandle: string;
    choiceHandle: string;
  }[];
}

export interface ClientCartTicket extends CartTicket {
  tempId: string;
  merchantPaymentId?: string;
  menuPrice: number;
  menuTitle: string;
  options: {
    optionHandle: string;
    choiceHandle: string;
    choiceName: string;
    isDefault: boolean;
    priceDiff: number;
  }[];
}
