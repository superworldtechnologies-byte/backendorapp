import PawIcon from "@/icons/icon1";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-white to-[#E7EBFC] px-4 py-10">
            <div
                className="mx-auto w-full rounded-3xl bg-cover bg-center px-8 py-12 lg:px-16"
                style={{
                    backgroundImage:
                        "url('/YaDj5qGDKZG2c6V9SyodRKc4.avif')",
                }}
            >
                <div className="flex flex-col justify-between gap-12">
                    <div className="flex flex-col justify-between gap-12 lg:flex-row">
                        {/* Left Side */}
                        <div className="space-y-10">
                            <div>
                               <PawIcon className="h-10 w-10 text-black" />

                                <p className="mt-3 max-w-xs whitespace-pre-line text-base text-zinc-900">
                                    Trusted pet care for a{"\n"}
                                    healthier, happier life.
                                </p>
                            </div>

                            {/* Social Icons */}
                            <div className="flex gap-4">
                                <img
                                    src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Q8iVEHnhHH/ir0waar1_expires_30_days.png"
                                    alt="Social"
                                    className="h-10 w-10"
                                />
                                <img
                                    src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Q8iVEHnhHH/d21ymuou_expires_30_days.png"
                                    alt="Social"
                                    className="h-10 w-10"
                                />
                                <img
                                    src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Q8iVEHnhHH/rsyr3dcg_expires_30_days.png"
                                    alt="Social"
                                    className="h-10 w-10"
                                />
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="grid gap-12 sm:grid-cols-2">
                            {/* Navigation */}
                            <div>
                                <h3 className="mb-4 text-lg font-medium text-zinc-600">
                                    Navigation
                                </h3>

                                <ul className="space-y-3 text-[17px] text-zinc-900">
                                    <li>
                                        <a href="#">About Us</a>
                                    </li>
                                    <li>
                                        <a href="#">Why Us</a>
                                    </li>
                                    <li>
                                        <a href="#">Services</a>
                                    </li>
                                    <li>
                                        <a href="#">How It Works</a>
                                    </li>
                                    <li>
                                        <a href="#">Reviews</a>
                                    </li>
                                    <li>
                                        <a href="#">Error 404</a>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h3 className="mb-4 text-lg font-medium text-zinc-600">
                                    Contact Us
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Q8iVEHnhHH/g6aa7g0a_expires_30_days.png"
                                            alt="Location"
                                            className="h-6 w-6"
                                        />
                                        <span className="text-[17px] text-zinc-900">
                                            Amsterdam Netherlands
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <img
                                            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Q8iVEHnhHH/4uy3a1cq_expires_30_days.png"
                                            alt="Phone"
                                            className="h-6 w-6"
                                        />
                                        <span className="text-[17px] text-zinc-900">
                                            +1 23 45 67 890
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <img
                                            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Q8iVEHnhHH/l0f968ee_expires_30_days.png"
                                            alt="Email"
                                            className="h-6 w-6"
                                        />
                                        <span className="text-[17px] text-zinc-900">
                                            info@pawsy.com
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="border-t border-zinc-200 pt-6">
                        <p className="text-sm text-zinc-600">
                            ©2026 Pawsy. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}