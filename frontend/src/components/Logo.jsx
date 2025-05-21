import logo from "../logo/LogoSample_ByTailorBrands.jpg";

const Logo = () => {
    return (
        <div>
            <h4 className="logo"><img src={logo} alt="logo" height={20} width={40} /> <div>URL Shortener</div></h4>
        </div>
    )
}

export default Logo;