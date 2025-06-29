"use client";
import { ReactElement } from "react";
import * as Styled from "./styles";
import { AlertType } from "@/context/AlertContext";

export interface AlertMessageProps {
  message: string;
  type?: AlertType;
}

export const AlertMessage = ({ message, type = "error" }: AlertMessageProps): ReactElement => {
  return <Styled.Container data-type={type}>{message}</Styled.Container>;
};
