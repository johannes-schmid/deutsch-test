-- A Beispiel can have more than one item (DTZ Hören Teil 3: one richtig/falsch and one a/b/c), so drop the
-- one-example-per-stimulus index. Scored item numbers stay unique per set (mt_questions_item_number).
drop index if exists public.mt_questions_example_per_stimulus;
