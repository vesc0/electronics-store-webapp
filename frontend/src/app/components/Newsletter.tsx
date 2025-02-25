import { AiOutlineCalendar } from "react-icons/ai";

const Newsletter = () => {
    return (
        <div className="relative isolate overflow-hidden bg-gray-900 py-12 flex items-center justify-center">
            <div className="grid max-w-7xl grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 lg:px-8">
                {/* Left Section */}
                <div>
                    <h2 className="text-4xl font-semibold tracking-tight text-white">
                        Subscribe to our newsletter
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                        Get updates about the latest devices.
                    </p>
                    <form className="mt-6 flex max-w-md gap-x-4">
                        <label htmlFor="email-address" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            className="flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-indigo-500"
                        />
                        <button
                            type="submit"
                            className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-center text-center">
                    <div className="rounded-md bg-white/5 p-4 ring-1 ring-white/10">
                        <AiOutlineCalendar aria-hidden="true" className="text-white text-6xl" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">Weekly articles</h3>
                    <p className="mt-2 text-lg text-gray-400">
                        Get weekly updates about the latest devices, best deals, coupons, and more.
                    </p>
                </div>
            </div>
            <div
                aria-hidden="true"
                className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                />
            </div>
        </div>
    )
}

export default Newsletter;