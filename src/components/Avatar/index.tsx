import Image from 'next/image'
import React from 'react'

type AvatarProps = {
  src: string
  alt: string
}

const Avatar = ({ src, alt }: AvatarProps) => {
  return (
    <div>
      <Image src={src} alt={alt} fill className="rounded-full" />
    </div>
  )
}

export default Avatar
