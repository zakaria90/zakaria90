import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { FrmProjectJob } from './app/FrmProjectJob/FrmPorjectJob';
import { FrmWarehouse } from './app/FrmWareHouse/FrmWareHouse';
import { FrmCurrency } from './app/FrmCurrency/FrmCurrency';
import { FrmBranch } from './app/frmBranch/frmbranch';
import { Header } from './app/header/header';
import { NotFound } from './app/NotFound/NotFound';
import { Home } from './app/home/home';
import { FrmFamily } from "./app/FrmFamily/FrmFamily";
import { FrmManageItem } from './app/FrmManageItem/FrmManageItem';
export default withRouter(
    function App({ location }) {
        const { t } = useTranslation();
        const [selected_main_item, setSelectedMainItem] = useState(0);
        const [currentPath, setCurrentPath] = useState(location.pathname);

        const isCollapsed = true;
        const homeProps = { selected_main_item: selected_main_item, MainItemClick: MainItemClick, translation: t }
        const headerProps = { selected_main_item: selected_main_item, MainItemClick: MainItemClick, translation: t, changeLanguage: changeLanguage, isCollapsed: isCollapsed }
        const CurrencyProps = { translation: t, handleClick: changeLanguage };
        const WarehouseProps = { translation: t, handleClick: changeLanguage };
        const branchProps = { translation: t, handleClick: changeLanguage };
        const NotFoundProps = { translation: t, handleClick: changeLanguage };
        const FamilyProps = { translation: t };
        const ProjectJobProps = { translation: t };
        const ManageItemProps = { translation: t };
        function changeLanguage(e) {
            const lang = e.target.value;
            i18next.changeLanguage(lang);
            if (lang === 'ar') {
                document.body.style.direction = 'rtl';
            } else {
                document.body.style.direction = 'ltr';
            }
        }
        function MainItemClick(item) {
            setSelectedMainItem(item);
        }
        useEffect(() => {
            const { pathname } = location;
            setCurrentPath(pathname);
            document.title = pathname === "/" ? "Home" : pathname.substring(1);
        }, [location.pathname]);

        function download(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }
        function getLanguages() {
            let fl_arabic = "";
            let fl_english = "";
            let fl_french = "";
            let fl_portuguese = "";
            let fl_spanish = "";
            const paramname = [];
            fetch(`http://localhost:9000/bomain/formslanguages/sel_formlanguages`)
                .then(response => response.json())
                .then(response => {
                    let comma = "";
                    response.map((lang, i) => {
                        var key = lang.fl_paramname;
                        // console.log(paramname.find(x => x === key) || typeof paramname.find(x => x === key) === 'undefined')
                        if (paramname.find(x => x === key) === '' || typeof paramname.find(x => x === key) === 'undefined') {
                            paramname.push(key);
                            const en = comma + '"' + key + '":"' + lang.fl_english + '"';
                            fl_english += en;
                            const ar = comma + '"' + key + '":"' + lang.fl_arabic + '"';
                            fl_arabic += ar;
                            const sp = comma + '"' + key + '":"' + lang.fl_spanish + '"';
                            fl_spanish += sp;
                            const pt = comma + '"' + key + '":"' + lang.fl_portuguese + '"';
                            fl_portuguese += pt;
                            const fr = comma + '"' + key + '":"' + lang.fl_french + '"';
                            fl_french += fr;
                            comma = ","
                        }

                        if (response.length == i + 1) {
                            console.log(['paramname', paramname]);
                            // download('translation_en.json', "{" + fl_english + "}");
                            // download('translation_ar.json', "{" + fl_arabic + "}");
                            // download('translation_fr.json', "{" + fl_french + "}");
                            // download('translation_sp.json', "{" + fl_spanish + "}");
                            // download('translation_pt.json', "{" + fl_portuguese + "}");
                        }
                    }
                    );
                })
                .catch(err => console.log(err));
        }

        return (
            <div className="App">
                <div className="bg">

                    <Header config={headerProps}></Header>
                    <div id="main">
                        <Switch>
                            <Route path={['/home', '']} exact component={() => <Home config={homeProps}></Home>} ></Route>
                            <Route path="/currency" component={() => <FrmCurrency config={CurrencyProps} />} />
                            <Route path="/warehouse" component={() => <FrmWarehouse config={WarehouseProps} />}></Route>
                            <Route path="/branch" component={() => <FrmBranch config={branchProps} />}></Route>
                            <Route path="/projectJob"><FrmProjectJob config={ProjectJobProps}></FrmProjectJob></Route>
                            <Route path="/frmFamily" component={() => <FrmFamily config={FamilyProps}></FrmFamily>}></Route>
                            <Route path="/Manageitems" component={() => <FrmManageItem config={ManageItemProps} />}></Route>
                            <Route component={() => <NotFound config={NotFoundProps} />}></Route>
                        </Switch>
                    </div>
                </div>
            </div>
        );
    });
