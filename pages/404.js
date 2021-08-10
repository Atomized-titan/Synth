/* eslint-disable @next/next/link-passhref */
import Link from 'next/link';


export default function Custom404() {
    return (
        
        <main className="four-container">
            <Link href="/"><button>Go Home!</button></Link>
            <h1 className="four-h1">404</h1>
        </main>
    );
}