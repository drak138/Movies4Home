export default function RedirectPage(){
    

    return(
        <section className="redirectContainer">
            <header className="newUrlHeader">
                <h1>Page has moved to a new url</h1>
            </header>
            <p>All your profiles and information will be retained you just need to log back in</p>
            <a className="newLink" href="https://movies4home.vercel.app/">https://movies4home.vercel.app/</a>
        </section>
    )
}