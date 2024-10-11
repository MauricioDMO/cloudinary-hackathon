"use client"

import { useState } from "react";

export default function InputSearch() {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true)
    const response = await fetch(`/api/get-image?url=${search}`)
    const image = await response.blob()
    setLoading(false)
    setImage(URL.createObjectURL(image))
  }

  return (
    <>
      <input
        className="text-black px-2 mx-4"
        type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
      <button onClick={handleSearch} >Search</button>
      {
        loading ? <div>Loading...</div> : null
      }
      {
        image ? <img
          className="mx-auto max-w-md"
          src={image}
          alt="search result" /> : null
      }
    </>
  )
}