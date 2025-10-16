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
    --=======================`==================================
    component top_module
        port (
            -- TODO: define the ports
        );
    end component;
    --=========================================================
    -- Internal Signal Declarations, constants and clock period
    --=========================================================
    -- TODO: declare signals to connect to DUT ports

begin
    --=========================================================
    -- Instantiate the DUT
    --=========================================================
    uut: top_module
        port map (
            -- TODO: connect signals to DUT ports
        );

    --=========================================================
    -- Clock Generation Process
    --=========================================================
    clk_process : process
    begin
        -- TODO: implement clock generation if needed
    end process;

    --=========================================================
    -- Reset and Stimulus Process
    --=========================================================
    stim_proc : process
    begin
        -- TODO: apply test vectors to DUT inputs
    end process;

end architecture;
