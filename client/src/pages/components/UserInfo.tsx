import { getUserByName } from "../../models/users";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "./Spinner";

type UserInfoProps = {
    username: string;
    profilePicture?: string;
     bio?: string;
}

export function UserInfo({ username, profilePicture, bio }: UserInfoProps) {
    