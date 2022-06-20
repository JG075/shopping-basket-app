import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { useEffect, useState } from "react"
import productAPI, { SuccessResponse } from "../api/product"

import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
    const [error, setError] = useState(false)
    const [data, setData] = useState<SuccessResponse["data"]>()

    const fetchData = async () => {
        try {
            const res = await productAPI.get()
            setData(res.data)
        } catch (error) {
            setError(true)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const renderProducts = () => {
        if (error) return <p>Error!</p>
        if (!data) return <p>Loading...</p>

        return (
            <ul>
                {data.map(({ id, name, thumbnail, cost }) => {
                    return (
                        <li key={id}>
                            <Image src={thumbnail} alt={name} height={250} width={250} />
                            <span>{name}</span>
                            <span>£{cost}</span>
                        </li>
                    )
                })}
            </ul>
        )
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Nextjs Shopping Cart</title>
                <meta name="description" content="A next shopping cart app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1>Nextjs Shopping Cart</h1>
                {renderProducts()}
            </main>
        </div>
    )
}

export default Home
