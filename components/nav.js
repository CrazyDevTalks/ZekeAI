import Link from 'next/link';

export default function Nav() {
    return (
        <nav className="navbar navbar-default navbar-custom navbar-fixed-top">
            <div className="container-fluid">
                <div className="navbar-header page-scroll">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span className="sr-only">Toggle navigation</span>
                        Menu <i className="fa fa-bars"></i>
                    </button>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav navbar-right" style={{ marginTop: "20px" }}>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/dreamscape">Dreamscape</Link>
                        </li>
                        <li>
                            <Link href="/mint">Mint</Link>
                        </li>
                        <li>
                            <Link href="https://hubculture.com/membership">Membership</Link>
                        </li>
                        <li>
                            <Link href="https://hubculture.com/aboutus">About</Link>
                        </li>
                        <li>
                            <Link href="https://hubculture.com/contact">Contact</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
