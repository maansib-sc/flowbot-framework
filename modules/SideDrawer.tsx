import { useContext, useRef } from "react";
import HamburgerIcon from "@/assets/HamburgerIcon";
import { Loader } from "@/components/ui";
import ThemeContext from "@/contexts/ThemeContext";
import Drawer from 'react-modern-drawer';
import DownloadIcon from "@/assets/svgs/DownloadIcon";
import { useTainPDF } from "@/hooks/useTrainPDF";



export const SideDrawer = ({ open, setOpen }: { open: boolean, setOpen: (val: boolean) => void }) => {

    const { JSModule, styles } = useContext(ThemeContext);
    const {handlePDFFileChange} = useTainPDF()

    const fileInputRef = useRef(null);


    return (
        <div>
            {JSModule?.drawerEnabled && (
                <div>
                    <Drawer
                        open={open}
                        onClose={() => setOpen(false)}
                        direction="right"
                        className="bla bla bla"
                        style={{ width: '400px' }}
                    >
                        <div className={styles['HamburgerContainer']}>
                            <div className={styles['HamburgerHeaderContainer']}>
                                <div className={styles['HamburgerHeader']}>
                                    Trained on documents
                                </div>
                            </div>
                            <div className={styles['Divider']}></div>
                            <div className={styles['UploaderHeader']}>Upload Document</div>
                            <div className={styles['UploadContainer']}>
                                {!false ? <div className={styles['UploadButtonContainer']}>
                                    <label className={styles['uploadButton']}>
                                        <input
                                            type="file"
                                            accept=".pdf,.docx"
                                            className="hidden"
                                            onChange={handlePDFFileChange}
                                            ref={fileInputRef}
                                        />
                                        <div style={{ transform: 'translateY(2px)' }} >
                                            <DownloadIcon />
                                        </div>
                                        <span style={{ transform: 'translateY(-2px)' }} className="mt-2 text-base leading-normal">
                                            Select a file
                                        </span>
                                    </label>
                                    <div>
                                        <span>Supported Files: Pdf</span>
                                    </div>
                                </div> :
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <div style={{ width: '150px', height: '150px' }}>
                                            <Loader loader="https://lottie.host/d1fd738a-f930-465e-b6ff-cf2412f791db/8r36ZWTWb2.json" />
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>

                    </Drawer>

                    <div style={{ position: 'absolute', top: 8, right: 20 }}>
                        <span
                            style={{ cursor: 'pointer', background: 'transparent' }}
                            onClick={() => setOpen(true)}
                        >
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <span style={{ margin: '0.5rem 0 0 0', color: JSModule?.editButtonColor }}>Managed Documents</span>
                                <HamburgerIcon iconColor={JSModule?.editButtonColor} />
                            </div>
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}