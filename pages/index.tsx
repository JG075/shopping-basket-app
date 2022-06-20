import type { NextPage } from "next"
import Head from "next/head"
import { useEffect, useState } from "react"
import productAPI from "../api/product"

import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState(false)

    const fetchData = async () => {
        setFetching(true)
        try {
            const data = await productAPI.get()
        } catch (error) {
            setError(true)
        }
        setFetching(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const renderProducts = () => {
        if (fetching) return <p>Loading...</p>
        if (error) return <p>Error!</p>
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
