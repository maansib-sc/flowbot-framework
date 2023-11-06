export const PromptModal = ({ data, onClose, onChangeHandler, resetTemplate, onSubmit }: { data: string, onClose: (val: string | undefined) => void, onChangeHandler: Function, resetTemplate: Function, onSubmit: Function }) => {

    return (
        <div className="fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none  bg-[#898b8cc9]">

            <div className="pointer-events-none relative top-20 w-auto translate-y-[-50px] transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px] ">

                <div className="min-h-576 pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-white-600">
                    <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2  border-opacity-100 p-4 dark:border-opacity-50">
                        <h5
                            className="text-xl font-medium leading-normal text-neutral-800 text-black"
                        >
                            Custom Prompt
                        </h5>
                        <button
                            type="button"
                            className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                            onClick={() => onClose("close")}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="h-6 w-6">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="relative  p-4" >
                        <textarea
                            className="w-full"
                            rows={16}
                            maxLength={10000}
                            value={data}
                            onChange={(e) => onChangeHandler(e.target.value)}
                        >
                        </textarea>
                    </div>

                    <div
                        className="flex flex-shrink-0 flex-wrap items-center justify-end  p-4 ">
                        <button
                            type="button"
                            className="inline-block  rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                            onClick={() => onClose("close")}>
                            Close
                        </button>
                        <button
                            type="button"
                            className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal "
                            onClick={() => resetTemplate()}
                        >
                            Reset changes
                        </button>
                        <button
                            type="button"
                            className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal "
                            onClick={() => onClose("submit")}
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}