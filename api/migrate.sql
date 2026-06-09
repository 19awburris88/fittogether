-- Migration: fix schema/route mismatches

-- wagers: routes use `target` and status default 'active'
ALTER TABLE wagers ADD COLUMN IF NOT EXISTS target INT DEFAULT 10;
ALTER TABLE wagers ALTER COLUMN status SET DEFAULT 'active';

-- wager_progress: routes use `value` + `won`, unique on (wager_id, user_id)
ALTER TABLE wager_progress ADD COLUMN IF NOT EXISTS value INT DEFAULT 0;
ALTER TABLE wager_progress ADD COLUMN IF NOT EXISTS won BOOLEAN DEFAULT FALSE;
ALTER TABLE wager_progress DROP CONSTRAINT IF EXISTS wager_progress_wager_id_user_id_day_index_key;
ALTER TABLE wager_progress ADD CONSTRAINT IF NOT EXISTS wager_progress_wager_id_user_id_key UNIQUE (wager_id, user_id);

-- rewards: routes select description + emoji columns
ALTER TABLE rewards ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE rewards ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '🎁';

UPDATE rewards SET description = 'Exclusive badge for power couples', emoji = '🏅' WHERE id = 'badge1';
UPDATE rewards SET description = 'Unlock a new look for your avatar', emoji = '👟' WHERE id = 'skin1';
UPDATE rewards SET description = 'Discount at our meal prep partner',  emoji = '🥗' WHERE id = 'perk1';
