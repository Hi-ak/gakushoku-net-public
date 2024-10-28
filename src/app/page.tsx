import Image from "next/image";
import styles from "./page.module.css";
import { redirect } from "next/navigation";

const TopPage = () => {
  redirect("/menu");
};

export default TopPage;
