'use client'
import axios from "axios"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect } from "react"
export default function SignUp() {
  const router = useRouter()
  const onSubmit = async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    try {
      const formData = new FormData(e.currentTarget);
      const body = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      };
      const data = await axios.post("http://localhost:7800/api/register", body, {withCredentials: true});
      if (data.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
      (async () => {
        const res = await fetch("http://localhost:7800/api/me", {
          credentials: "include",
        });
        if (res.ok) router.replace("/");
      })();
    }, [router]);
  return (
     <div className="w-100 h-100 bg-black text-white">
      <form onSubmit={onSubmit} action="/api/register" method="POST" className="my-3">
       <div>
          <label htmlFor="name">Name kiriting</label>
          <br />
          <input
            type="name"
            className="border-white border"
            name="name"
            id="name"
            placeholder="name"
          />
        </div>
        <div>
          <label htmlFor="email">Emailni kiriting</label>
          <br />
          <input
            type="email"
            className="border-white border "
            name="email"
            id="email"
            placeholder="email"
          />
        </div>
        <div>
          <label htmlFor="password">Passwordni kiriting</label>
          <br />
          <input
            type="password"
            className="border-white border "
            name="password"
            id="password"
            placeholder="password"
          />
        </div>
        <button type="submit">ok</button>
      </form>
      <button onClick={() => router.push("/auth/signin")}>Signin</button>
    </div>
  )
}
