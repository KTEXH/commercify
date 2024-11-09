declare const useScrollLock: () => {
    scrollLocked: boolean;
    lockScroll: () => void;
    unlockScroll: () => void;
};
export default useScrollLock;
