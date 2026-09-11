'use client'

import TodosList from "@/app/todo-list/TodosList";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/todo-list")
  })
  return <div>redirecting...</div>
}