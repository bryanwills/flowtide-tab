import { useState, useEffect, useRef } from "react";
import { CommandPalette } from "@/components/cmd";
import CharacterCounter from "@/CharacterCounter";
import WordCounter from "@/WordCounter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@flowtide/ui";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import {
  SettingsIcon,
  Sun,
  Moon,
  Computer,
  List,
  Plus,
  Trash,
  Edit,
  AudioLines,
  MenuIcon,
  Settings,
} from "lucide-react";
import { Button } from "@flowtide/ui";
import { useTheme } from "@flowtide/ui";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@flowtide/ui";
import { Checkbox } from "@flowtide/ui";
import { Input } from "@flowtide/ui";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@flowtide/ui";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@flowtide/ui";
import data from "../public/_locales/en/messages.json";

const dbName = "flowtide";
const dbVersion = 1;
const mantras = [
  "mantra_1",
  "mantra_2",
  "mantra_3",
  "mantra_4",
  "mantra_5",
  "mantra_6",
  "mantra_7",
  "mantra_8",
  "mantra_9",
  "mantra_10",
  "mantra_11",
  "mantra_12",
  "mantra_13",
  "mantra_14",
  "mantra_15",
];

type MessageKeys = any;

interface data {
  [key: string]: { message: string };
}

if (!chrome.i18n) {
  let jsonData: data = data;
  chrome.i18n = {
    getMessage: (message: MessageKeys) => {
      return (jsonData[message] as { message: string }).message;
    },
  } as any;
}

const randomMantra = mantras[Math.floor(Math.random() * mantras.length)];

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open(dbName, dbVersion);

    request.onerror = (event: any) =>
      reject("IndexedDB error: " + (event.target as IDBRequest)?.error);

    request.onsuccess = (event) =>
      resolve((event.target as IDBRequest)?.result);

    request.onupgradeneeded = (event: any) => {
      const db = (event.target as IDBRequest)?.result;
      if (!db.objectStoreNames.contains("todos")) {
        db.createObjectStore("todos", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("imageCache")) {
        db.createObjectStore("imageCache", { keyPath: "id" });
      }
    };
  });
};

const images = [
  "https://img.flowtide.app/D6128dhWEyDgPyqUneHFAiRv7GzkQ3tZcUSmjrNd6VExw9Jh.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgyooAV982sbnctFEejWoHDi1YUqJ3mKgNxXVp.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgLzKDb4GNstaRSlyigdBT4Z1mYhMbVIJX8Apw.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgof6TNeiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk.jpeg",
  "https://img.flowtide.app/D6128dhWEyDglUh7KeRF1iZYzrSR6Pvy4X03ebokADH9J87V.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgGcWHOCo6rIVCyNMgwjls0UZp5JzqKLmv38AT.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgFPCtMkqrL6kiHcgaQ1IUo9MjxO8ndE4Fq0bN.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgr4f66KvENtxud2o9LcAq8nvS7MUlfZIsJP3k.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgN629iFU0LT4M6Up89rolmxAfVd3eFuZvQyEC.jpeg",
  "https://img.flowtide.app/D6128dhWEyDghREhMXVIjgvYrUfRZTCctk7S1q5NpaJsDXQ8.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgX4hHi4rohSmd1bgqzcURawVyYNpnTI6ZHF7Q.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgCsIdnHXfbyhE3LuGsRM1Q9oZP0elv4nkDgpi.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgmveMLLcxTzpRywahCdem1LBcVs457lOI0XDq.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgvHWNnw1pj2S0Q8hV1swqFYn5G6r7uBtaxJRb.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgnvUEjTvXzHwgo4CriD32JdTa19yM8ZLNcqUK.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg9CLctpa8RVfu1gx4OIi5P0XzENoc6UevLsTH.jpeg",
  "https://img.flowtide.app/D6128dhWEyDguIRyfpzDuFQ2svylY84Sn1mfp3dRxNrObqWU.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgp4c8bhPYJKBSEwmnPxvIlTCQoi9cVF47afXM.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgUuCCE5wM8WVtQaUSJGIPou6nmXpxK1RdvLrN.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgUBAlno5wM8WVtQaUSJGIPou6nmXpxK1RdvLr.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgjByDHSCauIRlyF5cXsTSoUEtBnD6whdYNjrK.jpeg",
  "https://img.flowtide.app/D6128dhWEyDguR4J5zDuFQ2svylY84Sn1mfp3dRxNrObqWUV.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgxmWnqr9bZSe2sDFlvPu57CYfAQUtchqJz8wg.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgOhYKF5YuBovmrawFceg0UJ1y5Z2AYiuxQkdf.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgdjM61QwXK86uSIDEUgqpYfM9eGxV0WbCZtmv.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg7UVSwI0AL9tjnN24fbmHDy7Ok1VJoYr6ZScP.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgLBchCTGNstaRSlyigdBT4Z1mYhMbVIJX8Apw.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgHe1mO6nuTewkdl6BVM5rAtpxPGIFa4fH0UWD.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgHMYQqWnuTewkdl6BVM5rAtpxPGIFa4fH0UWD.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgXz1wzRrohSmd1bgqzcURawVyYNpnTI6ZHF7Q.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg4jfLbJKM8Zrop2kIEY9Dn5ePbcMLCitqmsuV.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgJEAvt6pp9ykNzg6MU5WLjo4rXmA1COws0EPS.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgR1XUt8J5JOc7ksyxnNmUHawrWGVS6DzThpLB.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgyYBlEcr82sbnctFEejWoHDi1YUqJ3mKgNxXV.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgW2f3vfYlqogbO3dBTsVQXGnieNvtfrkFAD6m.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgCeNaWvfbyhE3LuGsRM1Q9oZP0elv4nkDgpiV.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgNJQ2BRU0LT4M6Up89rolmxAfVd3eFuZvQyEC.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgYIy5HwBhrxmiLdCbNpEqOP2MwcaY3ujAz9S8.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgiykp0kt6Tzhmn9MAvpPjCxDwJIrH8RlV4L0F.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgtr29Q27Yk2j70f6F4z9pJo8DOqidQIBAyZe.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg3buUXmsT4wRBpgx589YjAqGOEbI6cHUrvzyi.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgiAbg1Y1t6Tzhmn9MAvpPjCxDwJIrH8RlV4L0.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgHTUMEcnuTewkdl6BVM5rAtpxPGIFa4fH0UWD.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgIiP4LPlbi23Qp80SgzZNnUdGJxath5BoYk9s.jpeg",
  "https://img.flowtide.app/D6128dhWEyDga9Doxdg3nHosRfpbYkCS2MhVPw6QZWr1yXdI.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgZvGNWRkzZ4aTb98m0VCO1weSjMrouvUcHyf3.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg10fj1dZahJ6ZRXyzMStWkYcVxNCdKfUq4e7D.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgZM5649kzZ4aTb98m0VCO1weSjMrouvUcHyf3.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgqU31obywZVRpKX0k1mJ7SsTnjir5AQaEdhgv.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgiJIKRVt6Tzhmn9MAvpPjCxDwJIrH8RlV4L0F.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgIJFg4p0lbi23Qp80SgzZNnUdGJxath5BoYk9.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgTmGMBBb2QH4PsORfG0jVebz8vgmlhxCXJqTy.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgCksSvqHJVK5ha7AgB43xbjIlyeo69GNS8QMp.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgAwfiUqNj6EKR2Bcz3sxD4SqVIW5pPCah8eFd.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgtNb9J4U7Yk2j70f6F4z9pJo8DOqidQIBAyZe.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgUeWY8K5wM8WVtQaUSJGIPou6nmXpxK1RdvLr.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgaeaGaOg3nHosRfpbYkCS2MhVPw6QZWr1yXdI.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgSyUIQJj38Q4IFcMKp2Ty07imVZ5DzWkJj9RA.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg7I2uo5AL9tjnN24fbmHDy7Ok1VJoYr6ZScPK.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgJhAuVxpp9ykNzg6MU5WLjo4rXmA1COws0EPS.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgLgdkZPGNstaRSlyigdBT4Z1mYhMbVIJX8Apw.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgGunV0To6rIVCyNMgwjls0UZp5JzqKLmv38AT.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgduiX8IwXK86uSIDEUgqpYfM9eGxV0WbCZtmv.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgrZLhZjWvENtxud2o9LcAq8nvS7MUlfZIsJP3.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgNz0GfY1U0LT4M6Up89rolmxAfVd3eFuZvQyE.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgfR6kNY3F3lNqIcvyjnSp4QJ8wLAbu6HVXkox.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgGTdGzao6rIVCyNMgwjls0UZp5JzqKLmv38AT.jpeg",
  "https://img.flowtide.app/D6128dhWEyDghgDUgIjgvYrUfRZTCctk7S1q5NpaJsDXQ8GI.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgfRO4Ji3F3lNqIcvyjnSp4QJ8wLAbu6HVXkox.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgcXPQC4HJVK5ha7AgB43xbjIlyeo69GNS8QMp.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgyqi5Sp82sbnctFEejWoHDi1YUqJ3mKgNxXVp.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgJE8Q1Zpp9ykNzg6MU5WLjo4rXmA1COws0EPS.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgqL9sL3ywZVRpKX0k1mJ7SsTnjir5AQaEdhgv.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgTlw9fb2QH4PsORfG0jVebz8vgmlhxCXJqTyE.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgOGFmMvuBovmrawFceg0UJ1y5Z2AYiuxQkdft.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgAbmV4aNj6EKR2Bcz3sxD4SqVIW5pPCah8eFd.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgiU9Z8rt6Tzhmn9MAvpPjCxDwJIrH8RlV4L0F.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg1KqHFmZahJ6ZRXyzMStWkYcVxNCdKfUq4e7D.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgLd5US0GNstaRSlyigdBT4Z1mYhMbVIJX8Apw.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgokYVhJiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgLiT6ZoQGNstaRSlyigdBT4Z1mYhMbVIJX8Ap.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg5YelLbzMZsyzNmTrg6fCY4onbJdOX81GV9Lu.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgX0NXLWrohSmd1bgqzcURawVyYNpnTI6ZHF7Q.jpeg",
  "https://img.flowtide.app/D6128dhWEyDghNlUAfIjgvYrUfRZTCctk7S1q5NpaJsDXQ8G.jpeg",
  "https://img.flowtide.app/D6128dhWEyDglO4aHJRF1iZYzrSR6Pvy4X03ebokADH9J87V.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgAMDQyDNj6EKR2Bcz3sxD4SqVIW5pPCah8eFd.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg4WqtWZM8Zrop2kIEY9Dn5ePbcMLCitqmsuVj.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgi15T1ot6Tzhmn9MAvpPjCxDwJIrH8RlV4L0F.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgW3K0VFYlqogbO3dBTsVQXGnieNvtfrkFAD6m.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgF8H5kJEqrL6kiHcgaQ1IUo9MjxO8ndE4Fq0b.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgbKtPnPx81ygt4ZMWafIGx7D5hXKuievPCw2j.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgCdqG7ufbyhE3LuGsRM1Q9oZP0elv4nkDgpiV.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgvPpz4v1pj2S0Q8hV1swqFYn5G6r7uBtaxJRb.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgoc1HEGiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgjQa0hcCauIRlyF5cXsTSoUEtBnD6whdYNjrK.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgXxdINyrohSmd1bgqzcURawVyYNpnTI6ZHF7Q.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgrZ3ipdvENtxud2o9LcAq8nvS7MUlfZIsJP3k.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg4QTWxzM8Zrop2kIEY9Dn5ePbcMLCitqmsuVj.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg4nEAlWM8Zrop2kIEY9Dn5ePbcMLCitqmsuVj.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgDMRnGJhWEyDguin6VpMtwF7PGLzbfvBJah1e.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgk1UrjiLBfrMVAaOGYjgl6D5bqzN8w0TWIURH.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgj5t18cCauIRlyF5cXsTSoUEtBnD6whdYNjrK.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg9kRrVXa8RVfu1gx4OIi5P0XzENoc6UevLsTH.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgsRh7JoOpbzeJNEyfZxSXg9nk4lVGrw3Lc2vR.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgf9StBe3F3lNqIcvyjnSp4QJ8wLAbu6HVXkox.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgoIzrOBiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgtLllhn7Yk2j70f6F4z9pJo8DOqidQIBAyZea.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgXJKPG7rohSmd1bgqzcURawVyYNpnTI6ZHF7Q.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgnvtn3lfXzHwgo4CriD32JdTa19yM8ZLNcqUK.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg83KSdXWZkzE6wj21eODm3Rc9T80Up5lBgMFW.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgG9zKq9o6rIVCyNMgwjls0UZp5JzqKLmv38AT.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg8rqmUbWZkzE6wj21eODm3Rc9T80Up5lBgMFW.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgJmQIwFpp9ykNzg6MU5WLjo4rXmA1COws0EPS.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgWEk2mVlYlqogbO3dBTsVQXGnieNvtfrkFAD6.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgaK5rHJg3nHosRfpbYkCS2MhVPw6QZWr1yXdI.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgPBLb7RFAiRv7GzkQ3tZcUSmjrNd6VExw9JhH.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgrC8KKZvENtxud2o9LcAq8nvS7MUlfZIsJP3k.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgGAuralo6rIVCyNMgwjls0UZp5JzqKLmv38AT.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg3uFxb0wsT4wRBpgx589YjAqGOEbI6cHUrvzy.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgA6rCMiNj6EKR2Bcz3sxD4SqVIW5pPCah8eFd.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgvsIsk01pj2S0Q8hV1swqFYn5G6r7uBtaxJRb.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgTGvGqQb2QH4PsORfG0jVebz8vgmlhxCXJqTy.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgXnSp7ErohSmd1bgqzcURawVyYNpnTI6ZHF7Q.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgko99n2YLBfrMVAaOGYjgl6D5bqzN8w0TWIUR.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgX1UfcjYrohSmd1bgqzcURawVyYNpnTI6ZHF7.jpeg",
  "https://img.flowtide.app/D6128dhWEyDgSYJ30pj38Q4IFcMKp2Ty07imVZ5DzWkJj9RA.jpeg",
  "https://img.flowtide.app/D6128dhWEyDg1uxptMZahJ6ZRXyzMStWkYcVxNCdKfUq4e7D.jpeg",
];

const colors = [
  "#61a5c2",
  "#c8b6ff",
  "#d1495b",
  "#70a288",
  "#3ab795",
  "#ff9770",
];

const gradients = [
  "linear-gradient(to bottom, #12c2e9, #c471ed, #f64f59)",
  "linear-gradient(to right, #348f50, #56b4d3)",
  "linear-gradient(to bottom, #da22ff, #9733ee)",
  "linear-gradient(to left, #02aab0, #00cdac)",
  "linear-gradient(to left, #ff6e7f, #bfe9ff)",
  "linear-gradient(to left, #314755, #26a0da)",
  "linear-gradient(to right, #ec008c, #fc6767)",
  "linear-gradient(to left, #1488cc, #2b32b2)",
  "linear-gradient(to right, #9796f0, #fbc7d4)",
  "linear-gradient(to left, #ffe259, #ffa751)",
  "linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)",
];

interface Task {
  task: string;
  completed: boolean;
  id: number;
  text?: string;
}

interface Bookmark {
  name: string;
  url: string;
}

function App() {
  const [time, setTime] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState({ url: "" });
  const [selectedPage, setSelectedPage] = useState("none");
  const { theme, setTheme } = useTheme();
  const [font, setFont] = useState(localStorage.getItem("font") || "sans");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState<string | undefined>("");
  const [rendered, setRendered] = useState(false);
  const [background, setBackground] = useState<string>(
    localStorage.getItem("background") || "wallpaper",
  );
  const [widgetPreferences, setWidgetPreferences] = useState(
    JSON.parse(localStorage.getItem("widgetPreferences") || "{}") || {
      mantras: "true",
      clock: "false",
      soundscapes: "false",
      todos: "false",
      bookmarks: "false",
      pomodoro: "true",
    },
  );
  const [onboardingComplete, setOnboardingComplete] = useState(
    localStorage.getItem("onboardingComplete") || false,
  );
  const [selectedColor, setSelectedColor] = useState(
    colors[Math.floor(Math.random() * colors.length)],
  );
  const [wallpaperLoaded, setWallpaperLoaded] = useState(false);
  const [gradient, setGradient] = useState(
    gradients[Math.floor(Math.random() * gradients.length)],
  );
  const [clockFormat, setClockFormat] = useState(() => {
    const format = localStorage.getItem("clockFormat");
    if (!format) {
      localStorage.setItem("clockFormat", "true");
      return true;
    }
    return format === "true";
  });
  const [changeTime, setChangeTime] = useState(
    Number(localStorage.getItem("changeTime")) ?? 1000 * 60 * 60 * 24,
  );
  const [showCompleted, setShowCompleted] = useState(() => {
    const saved = localStorage.getItem("showCompleted");
    return saved ? JSON.parse(saved) : false;
  });
  const [currentBlock, setCurrentBlock] = useState(
    chrome.i18n.getMessage("work"),
  );
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const currentFont =
    {
      serif: "font-serif",
      monospace: "font-mono",
      georgia: "font-georgia",
      sans: "font-sans",
      "brush-script-mt": "font-brush-script-mt",
      "times-new-roman": "font-times-new-roman",
      verdana: "font-verdana",
    }[font] || "";
  const [currentURL, setCurrentURL] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showMoreFonts, setShowMoreFonts] = useState(false);
  const [clockSize, setClockSize] = useState(
    localStorage.getItem("clockSize") || "medium",
  );
  const [clockMode, setClockMode] = useState(
    localStorage.getItem("clockMode") || "clock",
  );
  const [pomodoroTime, setPomodoroTime] = useState(
    parseInt(localStorage.getItem("pomodoroTime") || "0") || 25 * 60,
  );
  const [breakTime, setBreakTime] = useState(
    parseInt(localStorage.getItem("breakTime") || "0") || 5 * 60,
  );
  const [currentTimer, setCurrentTimer] = useState(pomodoroTime);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem("clockMode", clockMode);
  }, [clockMode]);

  useEffect(() => {
    localStorage.setItem("pomodoroTime", String(pomodoroTime));
  }, [pomodoroTime]);

  useEffect(() => {
    localStorage.setItem("breakTime", String(breakTime));
  }, [breakTime]);

  const soundscapes = [
    {
      name: chrome.i18n.getMessage("ocean"),
      emoji: "🌊",
      url: "https://utfs.io/f/VU8He2t54NdYu8EVsK5tgWb3e9PanFUMzSxQm0HhV1XofujB",
      volume: 1,
      attribution: [
        "Seawash (calm)  by craiggroshek -- https://freesound.org/s/176617/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYnavqSh6Uydx5HzbJtTENYqUwVaPOXZCnAiK2",
      index: 0,
    },
    {
      name: chrome.i18n.getMessage("forest"),
      emoji: "🌴",
      url: "https://utfs.io/f/VU8He2t54NdYuNACgha5tgWb3e9PanFUMzSxQm0HhV1Xofuj",
      volume: 1,
      attribution: [
        "Birds In Spring (Scotland) by BurghRecords -- https://freesound.org/s/463903/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYpgBC9am76CiVAS4EwQty3arMPfHR1bxgdkZD",
      index: 1,
    },
    {
      name: chrome.i18n.getMessage("rain"),
      emoji: "💦",
      url: "https://utfs.io/f/VU8He2t54NdY9vI0WdS2OVPpzlUIsm50S3eRo4JLb68vxBYA",
      volume: 1,
      attribution: [
        "Rain.wav by idomusics -- https://freesound.org/s/518863/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYOYYMxdZ45tUV7W1K4ESdzvZfN8Pr2yCwGuTiB",
      index: 2,
    },
    {
      name: chrome.i18n.getMessage("river"),
      emoji: "🪨",
      url: "https://utfs.io/f/VU8He2t54NdYd9CJeYhMOCr41owzn9sPYh5cNKJQFBEtaWu0",
      volume: 0.8,
      attribution: [
        "river small brook stream with rolling splashy good detail.flac by kyles -- https://freesound.org/s/454155/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYK6sDVKYu2OlbUPXGzdjtJ5iT6AaRH0yZuqD8",
      index: 3,
    },
    {
      name: chrome.i18n.getMessage("wind"),
      emoji: "💨",
      url: "https://utfs.io/f/VU8He2t54NdYhES01SIQ6Taob8Wf0SXDOuUA1VKkE9IHx4qd",
      volume: 1,
      attribution: [
        "wind.ogg by sleepCircle -- https://freesound.org/s/22331/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYvQshHTaHAWjPnCZrtxmV56SkaM3oO0qw4huf",
      index: 4,
    },
    {
      name: chrome.i18n.getMessage("fire"),
      emoji: "🔥",
      url: "https://utfs.io/f/VU8He2t54NdYGNe8h39BnItq9LXQlVPu4jNzU1xdaYCM0pF8",
      volume: 1,
      attribution: [
        "Bonfire by forfie -- https://freesound.org/s/364992/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYpRQh5Mcm76CiVAS4EwQty3arMPfHR1bxgdkZ",
      index: 5,
    },
    {
      name: chrome.i18n.getMessage("desert"),
      emoji: "🌵",
      url: "https://utfs.io/f/VU8He2t54NdYHpvbBvYhmu5O2LJfYdtvzgw0s3nbQXlkZDFS",
      volume: 1,
      attribution: [
        "Desert Simple.wav by Proxima4 -- https://freesound.org/s/104320/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYOYYMxdZ45tUV7W1K4ESdzvZfN8Pr2yCwGuTi",
      index: 6,
    },
    {
      name: chrome.i18n.getMessage("arctic"),
      emoji: "❄️",
      url: "https://utfs.io/f/VU8He2t54NdY6fCCfMVNjR9Nmtg7h50VGWKc8AQoryMUblvI",
      volume: 0.6,
      image:
        "https://utfs.io/f/VU8He2t54NdYxIBXaQ0DONIyCht8a6ZwdKgqEQSTLR51sMYB",
      attribution: [
        "Wind__Artic__Cold.wav by cobratronik -- https://freesound.org/s/117136/ -- License: Creative Commons 0",
      ],
      index: 7,
    },
    {
      name: chrome.i18n.getMessage("kettle"),
      emoji: "☕️",
      url: "https://utfs.io/f/VU8He2t54NdY59NfzQ6fcCLQl6pk53zFgINtnv9PqHDjbRJy",
      volume: 1,
      image:
        "https://utfs.io/f/VU8He2t54NdYH7NV0ddYhmu5O2LJfYdtvzgw0s3nbQXlkZDF",
      attribution: [
        "water boil.wav by fryzu82 -- https://freesound.org/s/142333/ -- License: Creative Commons 0",
      ],
      index: 8,
    },
    {
      name: chrome.i18n.getMessage("crickets"),
      emoji: "🦗",
      url: "https://utfs.io/f/VU8He2t54NdYOGnYUk45tUV7W1K4ESdzvZfN8Pr2yCwGuTiB",
      volume: 0.2,
      image:
        "https://utfs.io/f/VU8He2t54NdYDAOUVo88fqOGlaboRgjxshLUcB5MT4ZS2iE1",
      attribution: [
        "crickets by FreethinkerAnon -- https://freesound.org/s/129678/ -- License: Creative Commons 0",
      ],
      index: 9,
    },
    {
      name: chrome.i18n.getMessage("underwater"),
      emoji: "🐠",
      url: "https://utfs.io/f/VU8He2t54NdYrTIK1A7PtLG5Y82xDew0Ncpqo6IhCjBQRZOn",
      volume: 0.6,
      image:
        "https://utfs.io/f/VU8He2t54NdYI934tMkGS15s7ymktfMgw0zeF4dO2HlKZXbu",
      attribution: [
        "Underwater Ambience by Fission9 -- https://freesound.org/s/504641/ -- License: Creative Commons 0",
      ],
      index: 10,
    },
  ];

  function playSound(
    url: string,
    volume: number,
    name: string,
    image: string,
    index: number,
  ) {
    const audio = document.getElementById("player") as HTMLAudioElement;
    if (audio?.src === url && playing) {
      audio.pause();
    } else {
      audio.src = url;
      audio.volume = volume;
      audio.title = name;
      audio.setAttribute("image", image);
      audio.setAttribute("index", String(index));
      setCurrentURL(url);
      audio.play();
    }
  }

  useEffect(() => {
    const loadTasks = async () => {
      const db = await openDB();
      const transaction = db.transaction(["todos"], "readonly");
      const store = transaction.objectStore("todos");
      const request = store.getAll();

      request.onsuccess = (event: any) => {
        setTasks(event.target.result);
      };
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      console.log("Saving tasks");
      const db = await openDB();
      const transaction = db.transaction(["todos"], "readwrite");
      const store = transaction.objectStore("todos");

      await store.clear();

      tasks.forEach((task) => {
        store.add(task);
      });
    };

    saveTasks();
  }, [tasks]);

  const loadNewImage = async (setBackground: boolean) => {
    const newImage = images[Math.floor(Math.random() * images.length)];

    try {
      fetch(newImage, {
        mode: "no-cors",
        headers: {
          "Cache-Control": "public, max-age=315360000, immutable",
        },
      }).then((response) => {
        localStorage.setItem(
          "backgroundImage",
          JSON.stringify({
            url: newImage,
            expires: new Date().getTime() + changeTime,
          }),
        );

        if (setBackground) {
          setSelectedImage({ url: newImage });
        }
      });
    } catch (error) {
      console.error("Failed to cache image:", error);
    }
  };

  const checkCachedImage = () => {
    setRendered(true);
    let cachedImageUrl;
    try {
      cachedImageUrl = JSON.parse(
        localStorage.getItem("backgroundImage") || "null",
      );
    } catch (error) {
      cachedImageUrl = null;
    }

    if (cachedImageUrl) {
      setSelectedImage({ url: cachedImageUrl.url });
      if (navigator.onLine && new Date().getTime() > cachedImageUrl.expires) {
        loadNewImage(false);
      }
    } else {
      loadNewImage(true);
    }
  };

  useEffect(() => {
    if (!rendered) {
      if (background === "color") {
        setRendered(true);
      } else {
        checkCachedImage();
      }
      setInterval(() => {
        setTime(new Date());
      }, 1000);
    }
  }, [rendered]);

  useEffect(() => {
    if (
      widgetPreferences?.bookmarks === "true" &&
      chrome.bookmarks !== undefined
    ) {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        const flattenBookmarks = (nodes: any[]): Bookmark[] => {
          let bookmarks: Bookmark[] = [];
          for (const node of nodes) {
            if (node.url) {
              bookmarks.push({ name: node.title, url: node.url });
            }
            if (node.children) {
              bookmarks = bookmarks.concat(flattenBookmarks(node.children));
            }
          }
          return bookmarks;
        };
        const allBookmarks = flattenBookmarks(bookmarkTreeNodes);
        setBookmarks(allBookmarks);
      });
    }
  }, [widgetPreferences?.bookmarks]);

  const options: object = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: clockFormat,
  };

  const firstUncompletedTask = tasks.find((task) => !task.completed);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval: any;
    if (clockMode === "pomodoro" && isTimerRunning && currentTimer > 0) {
      interval = setInterval(() => {
        document.title = `${currentBlock} - ${formatTime(currentTimer - 1)}`;
        setCurrentTimer((prev) => prev - 1);
      }, 1000);
    } else if (currentTimer === 0) {
      setIsTimerRunning(false);
      const isWorkBlock = currentBlock === chrome.i18n.getMessage("work");
      setCurrentTimer(isWorkBlock ? breakTime : pomodoroTime);
      setCurrentBlock(
        isWorkBlock
          ? chrome.i18n.getMessage("break")
          : chrome.i18n.getMessage("work"),
      );
      setIsTimerRunning(true);
    }
    return () => clearInterval(interval);
  }, [clockMode, isTimerRunning, currentTimer, pomodoroTime, breakTime]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-screen !bg-cover transition-background-image background relative",
        currentFont,
      )}
      style={{
        backgroundColor: background === "color" ? selectedColor : "",
        backgroundImage: background === "gradient" ? gradient : "",
        transition:
          "background-image 0.4s ease-in-out, background-color 0.4s ease-in-out",
      }}
      id="app"
    >
      {background === "wallpaper" && (
        <img
          src={selectedImage.url}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity -z-10 opacity-0`}
          onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
            (e.target as HTMLImageElement).style.opacity = "1";
          }}
        />
      )}
      <audio
        className="hidden"
        id="player"
        loop
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
      <CommandPalette setSelectedPage={setSelectedPage} />
      <h1
        className={cn(
          "m-4 mb-0 text-4xl font-mono text-white select-none group",
          currentFont,
          {
            "text-9xl": clockSize === "large",
            "text-7xl": clockSize === "medium",
            "text-5xl": clockSize === "small",
          },
        )}
      >
        {widgetPreferences?.clock === "true" && (
          <div className="flex items-center space-x-2 ml-[40px] font-[600]">
            <span>
              {clockMode === "clock"
                ? time.toLocaleTimeString(undefined, options)
                : `${currentBlock} - ${formatTime(currentTimer)}`}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MenuIcon className="h-4 w-4 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setClockMode("clock");
                    setIsTimerRunning(false);
                  }}
                >
                  {chrome.i18n.getMessage("clock")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setClockMode("pomodoro");
                    setCurrentTimer(pomodoroTime);
                  }}
                >
                  {chrome.i18n.getMessage("pomodoro")}
                </DropdownMenuItem>
                {clockMode === "pomodoro" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                    >
                      {isTimerRunning
                        ? chrome.i18n.getMessage("pause")
                        : chrome.i18n.getMessage("start")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setIsTimerRunning(false);
                        setCurrentTimer(pomodoroTime);
                      }}
                    >
                      {chrome.i18n.getMessage("reset")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Settings className="mr-2 h-4 w-4" />
                          {chrome.i18n.getMessage("settings")}
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {chrome.i18n.getMessage("timer_settings")}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="pomodoro">
                              {chrome.i18n.getMessage("pomodoro")} (min)
                            </label>
                            <Input
                              id="pomodoro"
                              type="number"
                              className="col-span-3"
                              value={pomodoroTime / 60}
                              onChange={(e) => {
                                const newTime = parseInt(e.target.value) * 60;
                                setPomodoroTime(newTime);
                                if (!isTimerRunning) {
                                  setCurrentTimer(newTime);
                                }
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="break">
                              {chrome.i18n.getMessage("break_time")}
                            </label>
                            <Input
                              id="break"
                              type="number"
                              className="col-span-3"
                              value={breakTime / 60}
                              onChange={(e) => {
                                setBreakTime(parseInt(e.target.value) * 60);
                              }}
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </h1>
      <h3 className="text-2xl mt-3 text-shadow-lg !text-white">
        {widgetPreferences?.mantras === "true" &&
          chrome.i18n.getMessage(randomMantra)}
      </h3>
      {widgetPreferences?.todos === "true" &&
        tasks.some((task) => !task.completed) && (
          <div
            id="checkbox-container"
            className="flex items-center gap-2 text-xl mt-3"
          >
            <Checkbox
              id="clock_checkbox"
              onCheckedChange={(checked) => {
                setTasks((tasks: Task[]) =>
                  tasks.map((t: Task) =>
                    t.id === firstUncompletedTask?.id
                      ? { ...t, completed: checked === true }
                      : t,
                  ),
                );
              }}
              checked={false}
            />
            <label htmlFor="clock_checkbox">{firstUncompletedTask?.text}</label>
          </div>
        )}
      {widgetPreferences?.bookmarks === "true" && (
        <div className="mt-4 grid grid-cols-3 gap-4 max-w-4xl">
          {bookmarks.slice(0, 9).map((bookmark, index) => (
            <div
              key={index}
              onClick={() => window.open(bookmark.url, "_blank")}
              className="p-4 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 cursor-pointer transition-colors text-white text-center"
            >
              <div className="text-sm font-medium truncate">
                {bookmark.name}
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedPage === "character-counter" && (
        <CharacterCounter setSelectedPage={setSelectedPage} />
      )}
      {selectedPage === "word-counter" && (
        <WordCounter setSelectedPage={setSelectedPage} />
      )}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            aria-label={chrome.i18n.getMessage("settings")}
            className="text-white select-none absolute bottom-0 left-0 m-4"
          >
            <SettingsIcon className="h-5 w-5" />
            {chrome.i18n.getMessage("settings")}
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto" side="left">
          <SheetHeader>
            <SheetTitle>{chrome.i18n.getMessage("settings")}</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <h4 className="font-medium">
                {chrome.i18n.getMessage("features")}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="clock"
                    checked={widgetPreferences?.clock === "true"}
                    onCheckedChange={(checked) => {
                      setWidgetPreferences({
                        ...widgetPreferences,
                        clock: checked.toString(),
                      });
                      localStorage.setItem(
                        "widgetPreferences",
                        JSON.stringify({
                          ...widgetPreferences,
                          clock: checked.toString(),
                        }),
                      );
                    }}
                  />
                  <label
                    htmlFor="clock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                    "
                  >
                    {chrome.i18n.getMessage("clock")}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="soundscapes-checkbox"
                    checked={widgetPreferences?.soundscapes === "true"}
                    onCheckedChange={(checked) => {
                      setWidgetPreferences({
                        ...widgetPreferences,
                        soundscapes: checked.toString(),
                      });
                      localStorage.setItem(
                        "widgetPreferences",
                        JSON.stringify({
                          ...widgetPreferences,
                          soundscapes: checked.toString(),
                        }),
                      );
                    }}
                  />
                  <label
                    htmlFor="soundscapes-checkbox"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                    "
                  >
                    {chrome.i18n.getMessage("soundscapes")}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="todos-check"
                    checked={widgetPreferences?.todos === "true"}
                    onCheckedChange={(checked) => {
                      setWidgetPreferences({
                        ...widgetPreferences,
                        todos: checked.toString(),
                      });
                      localStorage.setItem(
                        "widgetPreferences",
                        JSON.stringify({
                          ...widgetPreferences,
                          todos: checked.toString(),
                        }),
                      );
                    }}
                  />
                  <label
                    htmlFor="todos-check"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                    "
                  >
                    {chrome.i18n.getMessage("todos")}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mantras-checkbox"
                    checked={widgetPreferences?.mantras === "true"}
                    onCheckedChange={(checked) => {
                      setWidgetPreferences({
                        ...widgetPreferences,
                        mantras: checked.toString(),
                      });
                      localStorage.setItem(
                        "widgetPreferences",
                        JSON.stringify({
                          ...widgetPreferences,
                          mantras: checked.toString(),
                        }),
                      );
                    }}
                  />
                  <label
                    htmlFor="mantras-checkbox"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                    "
                  >
                    {chrome.i18n.getMessage("mantras")}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bookmarks-checkbox"
                    checked={widgetPreferences?.bookmarks === "true"}
                    onCheckedChange={(checked) => {
                      setWidgetPreferences({
                        ...widgetPreferences,
                        bookmarks: checked.toString(),
                      });
                      localStorage.setItem(
                        "widgetPreferences",
                        JSON.stringify({
                          ...widgetPreferences,
                          bookmarks: checked.toString(),
                        }),
                      );
                    }}
                  />
                  <label
                    htmlFor="bookmarks-checkbox"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                    "
                  >
                    {chrome.i18n.getMessage("bookmarks")}
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">
                {chrome.i18n.getMessage("themes")}
              </h4>
              <div className="space-y-2">
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    theme === "dark" && "bg-accent",
                  )}
                  onClick={() => {
                    setTheme("dark");
                    localStorage.setItem("theme", "dark");
                  }}
                >
                  <span>{chrome.i18n.getMessage("dark_mode")}</span>
                  {theme === "dark" && <Check className="h-4 w-4" />}
                </button>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    theme === "light" && "bg-accent",
                  )}
                  onClick={() => {
                    setTheme("light");
                    localStorage.setItem("theme", "light");
                  }}
                >
                  <span>{chrome.i18n.getMessage("light_mode")}</span>
                  {theme === "light" && <Check className="h-4 w-4" />}
                </button>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    theme === "system" && "bg-accent",
                  )}
                  onClick={() => {
                    setTheme("system");
                    localStorage.setItem("theme", "system");
                  }}
                >
                  <span>{chrome.i18n.getMessage("system")}</span>
                  {theme === "system" && <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">{chrome.i18n.getMessage("font")}</h4>
              <div className="space-y-2">
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    font === "sans" && "bg-accent",
                  )}
                  onClick={() => {
                    setFont("sans");
                    localStorage.setItem("font", "sans");
                  }}
                >
                  <span>{chrome.i18n.getMessage("sans")}</span>
                  {font === "sans" && <Check className="h-4 w-4" />}
                </button>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    font === "monospace" && "bg-accent",
                  )}
                  onClick={() => {
                    setFont("monospace");
                    localStorage.setItem("font", "monospace");
                  }}
                >
                  <span>{chrome.i18n.getMessage("monospace")}</span>
                  {font === "monospace" && <Check className="h-4 w-4" />}
                </button>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    font === "serif" && "bg-accent",
                  )}
                  onClick={() => {
                    setFont("serif");
                    localStorage.setItem("font", "serif");
                  }}
                >
                  <span>{chrome.i18n.getMessage("serif")}</span>
                  {font === "serif" && <Check className="h-4 w-4" />}
                </button>
                <button
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-accent"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMoreFonts((prev) => !prev);
                  }}
                >
                  <span>
                    {showMoreFonts
                      ? chrome.i18n.getMessage("show_less")
                      : chrome.i18n.getMessage("show_more")}
                  </span>
                </button>
                {showMoreFonts && (
                  <div className="space-y-2">
                    <button
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2",
                        font === "times-new-roman" && "bg-accent",
                      )}
                      onClick={() => {
                        setFont("times-new-roman");
                        localStorage.setItem("font", "times-new-roman");
                      }}
                    >
                      <span>{chrome.i18n.getMessage("times_new_roman")}</span>
                      {font === "times-new-roman" && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2",
                        font === "verdana" && "bg-accent",
                      )}
                      onClick={() => {
                        setFont("verdana");
                        localStorage.setItem("font", "verdana");
                      }}
                    >
                      <span>{chrome.i18n.getMessage("verdana")}</span>
                      {font === "verdana" && <Check className="h-4 w-4" />}
                    </button>
                    <button
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2",
                        font === "georgia" && "bg-accent",
                      )}
                      onClick={() => {
                        setFont("georgia");
                        localStorage.setItem("font", "georgia");
                      }}
                    >
                      <span>{chrome.i18n.getMessage("georgia")}</span>
                      {font === "georgia" && <Check className="h-4 w-4" />}
                    </button>
                    <button
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2",
                        font === "brush-script-mt" && "bg-accent",
                      )}
                      onClick={() => {
                        setFont("brush-script-mt");
                        localStorage.setItem("font", "brush-script-mt");
                      }}
                    >
                      <span>{chrome.i18n.getMessage("brush_script_mt")}</span>
                      {font === "brush-script-mt" && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">
                {chrome.i18n.getMessage("background")}
              </h4>
              <div className="space-y-2">
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    background === "wallpaper" && "bg-accent",
                  )}
                  onClick={() => {
                    setBackground("wallpaper");
                    localStorage.setItem("background", "wallpaper");
                    window.location.reload();
                  }}
                >
                  <span>{chrome.i18n.getMessage("wallpaper")}</span>
                  {background === "wallpaper" && <Check className="h-4 w-4" />}
                </button>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    background === "color" && "bg-accent",
                  )}
                  onClick={() => {
                    setBackground("color");
                    localStorage.setItem("background", "color");
                    window.location.reload();
                  }}
                >
                  <span>{chrome.i18n.getMessage("color_palette")}</span>
                  {background === "color" && <Check className="h-4 w-4" />}
                </button>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    background === "gradient" && "bg-accent",
                  )}
                  onClick={() => {
                    setBackground("gradient");
                    localStorage.setItem("background", "gradient");
                    window.location.reload();
                  }}
                >
                  <span>{chrome.i18n.getMessage("gradient")}</span>
                  {background === "gradient" && <Check className="h-4 w-4" />}
                </button>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    background === "blank" && "bg-accent",
                  )}
                  onClick={() => {
                    setBackground("blank");
                    localStorage.setItem("background", "blank");
                    window.location.reload();
                  }}
                >
                  <span>{chrome.i18n.getMessage("blank")}</span>
                  {background === "blank" && <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">
                {chrome.i18n.getMessage("change_time")}
              </h4>
              <div className="space-y-2">
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    changeTime === Infinity && "bg-accent",
                  )}
                  onClick={() => {
                    setChangeTime(Infinity);
                    localStorage.setItem("changeTime", String(Infinity));
                  }}
                >
                  <span>{chrome.i18n.getMessage("never")}</span>
                  {changeTime === Infinity && <Check className="h-4 w-4" />}
                </button>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    changeTime === 0 && "bg-accent",
                  )}
                  onClick={() => {
                    setChangeTime(0);
                    localStorage.setItem("changeTime", String(0));
                  }}
                >
                  <span>{chrome.i18n.getMessage("as_soon_as_possible")}</span>
                  {changeTime === 0 && <Check className="h-4 w-4" />}
                </button>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    changeTime === 1000 * 60 * 60 && "bg-accent",
                  )}
                  onClick={() => {
                    setChangeTime(1000 * 60 * 60);
                    localStorage.setItem("changeTime", String(1000 * 60 * 60));
                  }}
                >
                  <span>{chrome.i18n.getMessage("every_hour")}</span>
                  {changeTime === 1000 * 60 * 60 && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    changeTime === 1000 * 60 * 60 * 24 && "bg-accent",
                  )}
                  onClick={() => {
                    setChangeTime(1000 * 60 * 60 * 24);
                    localStorage.setItem(
                      "changeTime",
                      String(1000 * 60 * 60 * 24),
                    );
                  }}
                >
                  <span>{chrome.i18n.getMessage("every_day")}</span>
                  {changeTime === 1000 * 60 * 60 * 24 && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">
                {chrome.i18n.getMessage("clock_format")}
              </h4>
              <div className="space-y-2">
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    clockFormat && "bg-accent",
                  )}
                  onClick={() => {
                    setClockFormat(true);
                    localStorage.setItem("clockFormat", "true");
                  }}
                >
                  <span>{chrome.i18n.getMessage("12_hour")}</span>
                  {clockFormat && <Check className="h-4 w-4" />}
                </button>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    !clockFormat && "bg-accent",
                  )}
                  onClick={() => {
                    setClockFormat(false);
                    localStorage.setItem("clockFormat", "false");
                  }}
                >
                  <span>{chrome.i18n.getMessage("24_hour")}</span>
                  {!clockFormat && <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">
                {chrome.i18n.getMessage("clock_size")}
              </h4>
              <div className="space-y-2">
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    clockSize === "small" && "bg-accent",
                  )}
                  onClick={() => {
                    setClockSize("small");
                    localStorage.setItem("clockSize", "small");
                  }}
                >
                  <span>{chrome.i18n.getMessage("small")}</span>
                  {clockSize === "small" && <Check className="h-4 w-4" />}
                </button>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    clockSize === "medium" && "bg-accent",
                  )}
                  onClick={() => {
                    setClockSize("medium");
                    localStorage.setItem("clockSize", "medium");
                  }}
                >
                  <span>{chrome.i18n.getMessage("medium")}</span>
                  {clockSize === "medium" && <Check className="h-4 w-4" />}
                </button>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                    clockSize === "large" && "bg-accent",
                  )}
                  onClick={() => {
                    setClockSize("large");
                    localStorage.setItem("clockSize", "large");
                  }}
                >
                  <span>{chrome.i18n.getMessage("large")}</span>
                  {clockSize === "large" && <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">{chrome.i18n.getMessage("more")}</h4>
              <div className="space-y-2">
                <button
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-accent"
                  onClick={() => {
                    window.open(
                      "https://github.com/thingbomb/flowtide/discussions",
                    );
                  }}
                >
                  <span>{chrome.i18n.getMessage("suggest_feature")}</span>
                </button>
                <button
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-accent"
                  onClick={() => {
                    window.open("https://docs.flowtide.app");
                  }}
                >
                  <span>{chrome.i18n.getMessage("documentation")}</span>
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {widgetPreferences?.todos == "true" && (
        <Popover>
          <PopoverTrigger asChild className="fixed bottom-0 right-0 z-50 m-4">
            <Button
              variant="ghost"
              aria-label="To-do list"
              className="text-white select-none"
            >
              <List className="h-5 w-5" />
              {chrome.i18n.getMessage("todos")}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "w-80 mr-4 max-h-[70vh] overflow-y-auto scrollbar",
              currentFont,
            )}
          >
            <div className="grid gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold leading-none">
                  {chrome.i18n.getMessage("todos")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {chrome.i18n.getMessage("todos_description")}
                </p>
              </div>
              <div id="tasks">
                {tasks
                  .filter((task) => showCompleted || !task.completed)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={(checked: boolean) => {
                            setTasks((tasks: Task[]) =>
                              tasks.map((t) =>
                                t.id === task.id
                                  ? {
                                      ...t,
                                      completed: checked === true,
                                    }
                                  : t,
                              ),
                            );
                          }}
                        />
                        <span
                          className="text-sm font-medium leading-none select-none focus-within:select-all outline-none"
                          onDoubleClick={(e) => {
                            (e.target as HTMLSpanElement).contentEditable =
                              "true";
                            (e.target as HTMLSpanElement).focus();
                          }}
                          onBlur={(e) => {
                            (e.target as HTMLSpanElement).contentEditable =
                              "false";
                            setTasks((tasks) =>
                              tasks.map((t) =>
                                t.id === task.id
                                  ? {
                                      ...t,
                                      text: e.target.innerText,
                                    }
                                  : t,
                              ),
                            );
                          }}
                        >
                          {task.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setTasks((tasks) =>
                              tasks.filter((t) => t.id !== task.id),
                            );
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setTaskInput(task.text);
                            setTasks((tasks) =>
                              tasks.filter((t) => t.id !== task.id),
                            );
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder={chrome.i18n.getMessage("add_todo")}
                />
                <Button
                  onClick={() => {
                    if (taskInput?.trim() !== "") {
                      setTasks((tasks: Task[]) => [
                        ...tasks,
                        {
                          id: Date.now(),
                          text: taskInput,
                          completed: false,
                        } as Task,
                      ]);
                      setTaskInput("");
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-completed"
                  checked={showCompleted}
                  onCheckedChange={(checked) => {
                    setShowCompleted(checked);
                    localStorage.setItem(
                      "showCompleted",
                      JSON.stringify(checked),
                    );
                  }}
                />
                <label
                  htmlFor="show-completed"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {chrome.i18n.getMessage("show_completed")}
                </label>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
      {widgetPreferences?.soundscapes == "true" && (
        <Popover>
          <PopoverTrigger asChild className="fixed top-0 left-0 z-50 m-4">
            <Button
              variant="ghost"
              aria-label={chrome.i18n.getMessage("soundscapes")}
              className="select-none text-white"
            >
              <AudioLines className="h-5 w-5" />
              {chrome.i18n.getMessage("soundscapes")}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "w-[300px] h-[300px] ml-4 relative overflow-y-auto scrollbar",
              currentFont,
            )}
          >
            <div>
              <ul className="flex flex-col gap-2">
                {soundscapes.map((sound, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      playSound(
                        sound.url,
                        sound.volume,
                        sound.name,
                        sound.image,
                        sound.index,
                      )
                    }
                    className="select-none cursor-pointer"
                  >
                    <b className="text-lg">{sound.name}</b>
                  </li>
                ))}
              </ul>
              <br />
              <a href="https://noisefill.com/credits">
                View sound attributions
              </a>
            </div>
          </PopoverContent>
        </Popover>
      )}
      {widgetPreferences?.bookmarks == "true" && (
        <Popover>
          <PopoverTrigger asChild className="fixed top-0 right-0 z-50 m-4">
            <Button
              variant="ghost"
              aria-label={chrome.i18n.getMessage("bookmarks")}
              className="select-none text-white"
            >
              <Computer className="h-5 w-5" />
              {chrome.i18n.getMessage("bookmarks")}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "w-[300px] h-[300px] mr-4 relative overflow-y-auto scrollbar",
              currentFont,
            )}
          >
            <div>
              <ul className="flex flex-col gap-2">
                {bookmarks.map((bookmark, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      window.open(bookmark.url, "_blank");
                    }}
                    className="select-none cursor-pointer"
                  >
                    <b>{bookmark.name}</b>
                    <br />
                    <span className="text-sm text-gray-500 dark:text-gray-300 break-all">
                      {bookmark.url}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

export default App;
