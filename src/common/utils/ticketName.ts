import { Ticket } from "../types/ticket";

export const getTicketNameWithOption = (ticket: {
  options: {
    choiceRelation: { choiceName: string; isDefault: boolean };
  }[];
  menuRelation: { title: string };
}) => {
  const filteredOptions = ticket.options.filter(
    (option) => !option.choiceRelation.isDefault
  );
  return (
    ticket.menuRelation.title +
    (filteredOptions.length > 0
      ? `（${filteredOptions
          .map((option) => option.choiceRelation.choiceName)
          .join("・")}）`
      : "")
  );
};
