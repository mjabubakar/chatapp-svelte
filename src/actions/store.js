import { writable } from "svelte/store";

export const display = writable("one");

export const userName = writable("");

export const profilePic = writable("");

export const bio = writable("");

export const myUsername = writable("");

export const chatId = writable("");

export const searchUser = writable("");

export const searchFriend = writable("");

export const currentMessage = writable("");

export const online = writable(false);
