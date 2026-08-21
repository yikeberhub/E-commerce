function Logo({ logo }) {
  return (
    <div className="flex flex-row items-center gap-2">
      <img
        src={logo}
        className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 hover:scale-110"
        alt="logo"
      />
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-700 tracking-wide transition-colors duration-300 hover:text-primary-600">
        ጣና ገበያ
      </h1>
    </div>
  );
}

export default Logo;
