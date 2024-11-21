export default function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                        <ul className="list-inline text-center">
                            <li>
                                <a target="blank" href="http://www.twitter.com/hubculture">
                                    <span className="fa-stack fa-lg">
                                        <i className="fa fa-circle fa-stack-2x"></i>
                                        <i className="fa fa-twitter fa-stack-1x fa-inverse"></i>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a target="blank" href="http://instagram.com/hubculture">
                                    <span className="fa-stack fa-lg">
                                        <i className="fa fa-circle fa-stack-2x"></i>
                                        <i className="fa fa-instagram fa-stack-1x fa-inverse"></i>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a target="blank" href="http://www.flickr.com/photos/hubculture">
                                    <span className="fa-stack fa-lg">
                                        <i className="fa fa-circle fa-stack-2x"></i>
                                        <i className="fa fa-flickr fa-stack-1x fa-inverse"></i>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a target="blank" href="http://www.youtube.com/hubculture">
                                    <span className="fa-stack fa-lg">
                                        <i className="fa fa-circle fa-stack-2x"></i>
                                        <i className="fa fa-youtube fa-stack-1x fa-inverse"></i>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a target="blank" href="https://www.facebook.com/hubculture">
                                    <span className="fa-stack fa-lg">
                                        <i className="fa fa-circle fa-stack-2x"></i>
                                        <i className="fa fa-facebook fa-stack-1x fa-inverse"></i>
                                    </span>
                                </a>
                            </li>
                        </ul>
                        <p className="copyright text-muted">Copyright &copy; {new Date().getFullYear()} Hub Culture</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}