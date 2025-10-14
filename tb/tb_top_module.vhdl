--=============================================================
-- Testbench Template (VHDL)
--=============================================================
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

-- No entity ports for a testbench
entity tb_top_module is
end entity;

architecture behavior of tb_top_module is

    --=========================================================
    -- DUT (Design Under Test) Component Declaration
    --=========================================================
    component top_module
        port ();
    end component;

    --=========================================================
    -- Internal Signal Declarations, constants and clock period
    --=========================================================
    signal clk_tb       : std_logic := '0';
    constant CLK_PERIOD : time := 10 ns;

begin
    --=========================================================
    -- Instantiate the DUT
    --=========================================================
    uut: top_module
        port map ();

    --=========================================================
    -- Clock Generation Process
    --=========================================================
    clk_process : process
    begin
        while true loop
            clk_tb <= '0';
            wait for CLK_PERIOD/2;
            clk_tb <= '1';
            wait for CLK_PERIOD/2;
        end loop;
    end process;

    --=========================================================
    -- Reset and Stimulus Process
    --=========================================================
    stim_proc : process
    begin
        -- Apply reset if needed
        -- wait for some time
        wait for 20 ns;
        -- Add stimulus here

        -- Finish simulation
        wait;
    end process;

end architecture;
