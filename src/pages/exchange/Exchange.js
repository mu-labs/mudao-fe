import React from "react";
import Header from "../../components/header/Header.js";
import Footer from "../../components/footer/Footer.js";
import { Select } from "@material-ui/core";
import logo from "../../assets/logowhite.svg";
import logoS from "../../assets/logoS.svg";
export default function Exchange() {
    return (
        <div>
            <Header color="text-white bg-blue-200" logo={logo} lineClass="bg-white" buttonClass="border-2 border-white" />
            <div className="bg-blue-200">
                <div className=" text-white bg-center bg-100  pt-4 flex justify-start">
                    <div className="flex items-end flex-col pl-12">
                        <p className="text-7xl font-eczar t font-semibold">
                            MuDao
                        </p>
                        <p className="text-sm font-poppins border-t-2 -mt-6 border-white ">
                            EXCHANGE
                        </p>
                    </div>
                </div>
                <div className="flex justify-center pt-4 pb-6">
                    <div className="bg-gray-300 lg:w-1/3 w-full mx-4">
                        <div className="grid grid-cols-2 border-b border-gray-400 mb-4 text-white text-center">
                            <p className="border-b-2 border-blue-300 py-2">
                                Trade
                            </p>
                            <p className="py-2">
                                Pool
                            </p>
                        </div>
                        <div className="border-2 flex justify-between border-gray-400 p-2 px-4 rounded-xl text-white">
                            <div>
                                <p className="font-poppins mb-2">
                                    Input
                                </p>
                                <input placeholder="0.00" className="bg-transparent text-gray-500 text-xl" />
                            </div>
                            <div>
                                <div className="flex font-poppins">
                                    <p className="mr-2">
                                        Balance:
                                    </p>
                                    <p>
                                        0.000
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <img className="w-6 h-6" src={logoS} alt=""/>
                                    <select className="text-white bg-transparent" name="cars" id="cars">
                                        <option value="SOL">SOL</option>
                                        <option value="SRM">SRM</option>
                                        <option value="FIDA">FIDA</option>
                                        <option value="MU">MU</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                        <div className="flex justify-center my-4">
                            <img className="w-6 h-6" src={logoS} alt=""/>
                        </div>
                        <div className="border-2 flex justify-between border-gray-400 p-2 px-4 rounded-xl text-white">
                            <div>
                                <p className="font-poppins mb-2">
                                    To (estimate)
                                </p>
                                <input placeholder="0.00" className="bg-transparent text-gray-500 text-xl" />
                            </div>
                            <div>
                                <div className="flex font-poppins">
                                    <p className="mr-2">
                                        Balance:
                                    </p>
                                    <p>
                                        0.000
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <img className="w-6 h-6" src={logoS} alt=""/>
                                    <select className="text-white bg-transparent" name="cars" id="cars">
                                        <option value="SOL">SOL</option>
                                        <option value="SRM">SRM</option>
                                        <option value="FIDA">FIDA</option>
                                        <option value="MU">MU</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                        <button className="bg-blue-300 w-full py-2 text-white rounded mt-4 mb-4">
                            Connect Wallet
                        </button>
                    </div>
                </div>
                <div className="flex">
                    <p className="transform mb-12 font-poppins text-sm -rotate-90 text-white">
                        MUDAO
                    </p>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
