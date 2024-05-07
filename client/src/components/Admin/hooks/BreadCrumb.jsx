import { Link } from "react-router-dom";

const BreadCrumb = ({
    title,
    desc,
    link
}) => {

    return (
        <div className="mr-6 p-6">
            <p className="text-xl font-semibold mb-2">
                <Link to={link}>
                    {title}
                </Link>
                {desc}
            </p>
        </div>
    )
}


export default BreadCrumb;