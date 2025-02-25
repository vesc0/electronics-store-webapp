import Link from "next/link";
import Image from 'next/image';
import gadgetsImage from '../assets/gadgets-neon.png';

const Banner = () => {
    return (
        <div className="mb-2 mt-16">
            <div className="mx-0">
                <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                    <svg
                        viewBox="0 0 1024 1024"
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                    >
                        <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
                        <defs>
                            <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                                <stop stopColor="#7775D6" />
                                <stop offset={1} stopColor="#E935C1" />
                            </radialGradient>
                        </defs>
                    </svg>
                    <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            Shop the latest gadgets now.
                        </h2>
                        <p className="mt-6 text-pretty text-lg/8 text-gray-300">
                            Explore cutting-edge devices and unbeatable deals.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                            <Link
                                href="/products" passHref
                                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                Browse all products
                            </Link>
                            <Link href="/" passHref className="text-sm/6 font-semibold text-white">
                                Learn more <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                    <div className="relative mt-16 h-80 lg:mt-8">
                        <Image
                            alt="Gadgets"
                            src={gadgetsImage}
                            width={1824}
                            height={1080}
                            priority={true}
                            className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner;