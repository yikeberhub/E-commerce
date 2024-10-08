import React from "react";
import { useAuth } from "../../../../contexts/AuthContext";

function Address() {
  const { user } = useAuth();
  return (
    <div className="container mx-auto items-center">
      <div>
        <h1>Address Here</h1>
        <div className="bg-white">
          <form className=" w-auto px-2  py-2 shadow-lg shadow-gray-300 align-middle items-center  lg-mr-10 mt-2">
            <div className="flex flex-row gap-2">
              <div className="lg-w-64 py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-sm">
                <label className="mx-2 my-2">Full Name: </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
                />
              </div>
              <div className="lg-w-64 py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-sm">
                <label className="mx-2 my-2">Phone Number: </label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
                />
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="lg-w-64 py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-sm">
                <label className="mx-2 my-2">Kebele: </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
                />
              </div>
              <div className="lg-w-64 py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-sm">
                <label className="mx-2 my-2">City: </label>
                <input
                  type="text"
                  placeholder="Enter City name"
                  className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
                />
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="lg-w-64 py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-sm">
                <label className="mx-2 my-2">Region: </label>
                <input
                  type="text"
                  placeholder="Enter Region name"
                  className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
                />
              </div>
              <div className="lg-w-64 py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-sm">
                <label className="mx-2 my-2">Postal Code: </label>
                <input
                  type="text"
                  placeholder="Enter Postal Code(optional)"
                  className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
                />
              </div>
            </div>

            <div className="flex flex-row gap-6 items-center">
              <div className="lg-w-64 py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-sm">
                <label className="mx-2 my-2">Delivery Instructions: </label>
                <input
                  type="text"
                  placeholder="Enter Delivery Instructions Code(optional)"
                  className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
                />
              </div>
              <button className="bg-green-500 rounded-md py-1 px-2 hover:bg-purple-600">
                Update Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Address;
