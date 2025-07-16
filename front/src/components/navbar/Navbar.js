import React from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./nav.module.css";
import { useAuth } from "../../context/AuthContext";

const NavBar = () => {
    const { isAuthenticated, userRole, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className={style.sidebar}>
            {/* Logo */}
            <div className={style["user-info"]}>
                <img src="/logo.png" alt="Tournament Logo" className={style.logo} />
            </div>

            <div className={style.separator}></div>

            {/* Bloc 1: Accueil / News - Accessible à tous */}
            <div className={style.navBlock}>
                <Link to="/" className={style.navLink}>
                    <div className={style.navItem}>
                        <span className={style.navIcon}>📰</span>
                        <span className={style.navText}>Accueil / News</span>
                    </div>
                </Link>
            </div>

            <div className={style.separator}></div>

            {/* Bloc 2: Gestion des tournois et compétiteurs */}
            {(isAuthenticated && (userRole === 'user' || userRole === 'admin')) && (
                <>
                    <div className={style.navBlock}>
                        <Link to="/competiteurs" className={style.navLink}>
                            <div className={style.navItem}>
                                <span className={style.navIcon}>👥</span>
                                <span className={style.navText}>Liste Compétiteurs</span>
                            </div>
                        </Link>
                        
                        <Link to="/tournois" className={style.navLink}>
                            <div className={style.navItem}>
                                <span className={style.navIcon}>📋</span>
                                <span className={style.navText}>Liste des tournois</span>
                            </div>
                        </Link>
                    </div>
                    
                    <div className={style.separator}></div>
                </>
            )}

            {/* Bloc: Tournois en cours - Accessible uniquement aux utilisateurs authentifiés */}
            {isAuthenticated && (
                <>
                    <div className={style.navBlock}>
                        <Link to="/tournois-encours" className={style.navLink}>
                            <div className={style.navItem}>
                                <span className={style.navIcon}>🏃</span>
                                <span className={style.navText}>Tournois en cours</span>
                            </div>
                        </Link>
                    </div>
                    
                    <div className={style.separator}></div>
                </>
            )}

            {/* Bloc 3: Scoreboard et télécommande tournois - Réservé aux admins */}
            {isAuthenticated && userRole === 'admin' && (
                <>
                    <div className={style.navBlock}>
                        <Link to="/scoreboard-tournoi" className={style.navLink}>
                            <div className={style.navItem}>
                                <span className={style.navIcon}>📺</span>
                                <span className={style.navText}>Scoreboard tournois</span>
                            </div>
                        </Link>
                        
                        
                    </div>

                    <div className={style.separator}></div>

                    {/* Bloc 4: Scoreboard et télécommande vierges - Réservé aux admins */}
                    <div className={style.navBlock}>
                        <Link to="/scoreboard" className={style.navLink}>
                            <div className={style.navItem}>
                                <span className={style.navIcon}>🖥️</span>
                                <span className={style.navText}>Scoreboard vierge</span>
                            </div>
                        </Link>
                        
                        <Link to="/telecommande" className={style.navLink}>
                            <div className={style.navItem}>
                                <span className={style.navIcon}>🎚️</span>
                                <span className={style.navText}>Télécommande vierge</span>
                            </div>
                        </Link>
                    </div>
                    
                    <div className={style.separator}></div>

                    {/* Bloc 5: Example de Bracket */}
                    <div className={style.navBlock}>
                        <Link to="/bracket-example" className={style.navLink}>
                            <div className={style.navItem}>
                                <span className={style.navIcon}>✈️</span>
                                <span className={style.navText}>Bracket Exemple</span>
                            </div>
                        </Link>
                        
                      
                    </div>
                </>
            )}

            {/* Espaceur pour pousser les éléments du bas */}
            <div className={style.spacer}></div>

            <div className={style.separator}></div>

            {/* Bloc 5: Compte et Déconnexion / Connexion */}
            <div className={style.navBlock}>
                {isAuthenticated ? (
                    <>
                        <Link to="/profile" className={style.navLink}>
                            <div className={style.navItem}>
                                <span className={style.navIcon}>👤</span>
                                <span className={style.navText}>Mon Profil</span>
                            </div>
                        </Link>
                        
                        <div onClick={handleLogout} className={style.navLink}>
                            <div className={style.navItem}>
                                <span className={style.navIcon}>🚪</span>
                                <span className={style.navText}>Déconnexion</span>
                            </div>
                        </div>
                        <Link to="/support" className={style.navLink}>
                            <div className={style.navItem}>
                                <span className={style.navIcon}>👾</span>
                                <span className={style.navText}>Support</span>
                            </div>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={style.navLink}>
                            <div className={style.navItem}>
                                <span className={style.navIcon}>🔑</span>
                                <span className={style.navText}>Connexion</span>
                            </div>
                        </Link>
                        
                        <Link to="/register" className={style.navLink}>
                            <div className={style.navItem}>
                                <span className={style.navIcon}>📝</span>
                                <span className={style.navText}>Inscription</span>
                            </div>
                        </Link>
                        <Link to="/support" className={style.navLink}>
                            <div className={style.navItem}>
                                <span className={style.navIcon}>👾</span>
                                <span className={style.navText}>Support</span>
                            </div>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default NavBar;
