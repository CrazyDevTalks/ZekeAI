export default function Header({ children, style }) {
    return (
        <header className="intro-header">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                        <div className="site-heading" style={{ ...style }}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}