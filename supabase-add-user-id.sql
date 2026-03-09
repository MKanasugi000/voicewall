-- projectsテーブルにuser_idカラムを追加
ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id uuid;

-- 既存のdemoプロジェクトにuser_idを設定（あなたのSupabase Auth ユーザーIDに置き換え）
-- UPDATE projects SET user_id = 'YOUR_USER_ID' WHERE slug = 'demo';

-- projects の delete ポリシーを追加
CREATE POLICY "Allow public delete projects"
  ON projects FOR DELETE
  TO public
  USING (true);

-- projects の update ポリシーを追加
CREATE POLICY "Allow public update projects"
  ON projects FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- testimonials の delete ポリシーを追加
CREATE POLICY "Allow public delete testimonials"
  ON testimonials FOR DELETE
  TO public
  USING (true);
