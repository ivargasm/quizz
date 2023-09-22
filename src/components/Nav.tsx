import { useQuestionStore } from "../store/questions"
import { useEffect } from 'react'
// eslint-disable-next-line react/prop-types
export const Nav = ({setMostrar}:any) => {

    const theme = useQuestionStore(state => state.theme)
    const toggleTheme = useQuestionStore(state => state.toggleTheme)
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme]);

    return (
        <nav className="navbar">
            <div className="max-width">
                {/* <ul className="menu">
                    <li><a href="#begin" className="menu-btn">{esen.start}</a></li>
                    <li><a href="#skills" className="menu-btn">{esen.skills}</a></li>
                    <li><a href="#projects" className="menu-btn">{esen.projects}</a></li>
                    <li><a href="#contact" className="menu-btn">{esen.contact}</a></li>
                </ul> */}
                <div className="logo">
                    <button id="color-mode" onClick={toggleTheme}>
                        <i className="bi bi-circle-half"></i>
                    </button>
                    <button onClick={() => setMostrar(true)}>Info <span className="wave">👋</span></button>
                </div>
                <div className="menu-btn">
                    <i className="fas fa-bars" id="navbtn"></i>
                </div>
            </div>
        </nav>
    )
}
