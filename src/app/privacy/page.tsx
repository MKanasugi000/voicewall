import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー - VoiceWall",
};

export default function Privacy() {
  const s = {
    page: { minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, Noto Sans JP, sans-serif" } as const,
    nav: { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 24px", display: "flex", alignItems: "center", height: 60 } as const,
    content: { maxWidth: 800, margin: "0 auto", padding: "40px 20px 80px" } as const,
    h1: { fontSize: 28, fontWeight: 800, color: "#1e293b", marginBottom: 8 } as const,
    date: { fontSize: 13, color: "#94a3b8", marginBottom: 40 } as const,
    h2: { fontSize: 18, fontWeight: 700, color: "#1e293b", marginTop: 40, marginBottom: 12 } as const,
    p: { fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 16 } as const,
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <a href="/" style={{ fontSize: 20, fontWeight: 800, textDecoration: "none" }}>
          <span style={{ color: "#2563eb" }}>Voice</span>
          <span style={{ color: "#1e293b" }}>Wall</span>
        </a>
      </nav>
      <div style={s.content}>
        <h1 style={s.h1}>プライバシーポリシー</h1>
        <p style={s.date}>最終更新日: 2026年3月9日</p>

        <h2 style={s.h2}>1. 収集する情報</h2>
        <p style={s.p}>
          本サービスでは、以下の情報を収集します：
          アカウント情報（メールアドレス）、
          口コミ投稿者の情報（氏名、メールアドレス、肩書き、口コミ内容、評価）、
          決済情報（Stripeを通じて処理されるクレジットカード情報。なお、カード情報は本サービスのサーバーには保存されません）、
          アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）。
        </p>

        <h2 style={s.h2}>2. 情報の利用目的</h2>
        <p style={s.p}>
          収集した情報は、以下の目的で利用します：
          本サービスの提供・運営・改善、ユーザーサポート、
          料金の請求・決済処理、利用規約違反行為への対応、
          本サービスに関するお知らせの送信。
        </p>

        <h2 style={s.h2}>3. 第三者への提供</h2>
        <p style={s.p}>
          運営者は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：
          ユーザーの同意がある場合、法令に基づく場合、
          人の生命・身体・財産の保護のために必要がある場合。
          なお、決済処理のためStripe, Inc.に必要な情報が提供されます。
        </p>

        <h2 style={s.h2}>4. 外部サービスの利用</h2>
        <p style={s.p}>
          本サービスでは、以下の外部サービスを利用しています：
          Supabase（データベース・認証）、Stripe（決済処理）、Vercel（ホスティング）。
          各サービスのプライバシーポリシーについては、それぞれのウェブサイトをご確認ください。
        </p>

        <h2 style={s.h2}>5. データの保管</h2>
        <p style={s.p}>
          ユーザーのデータは、Supabaseのサーバーに安全に保管されます。
          データの転送にはSSL/TLS暗号化を使用しています。
          アカウントを削除した場合、関連するデータは合理的な期間内に削除されます。
        </p>

        <h2 style={s.h2}>6. Cookieの使用</h2>
        <p style={s.p}>
          本サービスでは、ユーザーの認証状態を維持するためにCookieおよびローカルストレージを使用しています。
          これらはサービスの基本機能に必要なものであり、トラッキング目的では使用しません。
        </p>

        <h2 style={s.h2}>7. ユーザーの権利</h2>
        <p style={s.p}>
          ユーザーは、自身の個人情報について、開示・訂正・削除を請求する権利を有します。
          これらの請求については、本サービスのお問い合わせ先までご連絡ください。
        </p>

        <h2 style={s.h2}>8. 口コミ投稿者のデータ</h2>
        <p style={s.p}>
          口コミ投稿者（エンドユーザー）が口コミフォームを通じて提供した情報は、
          当該プロジェクトのオーナーであるユーザーがアクセスし管理します。
          口コミ投稿者は、投稿時に情報の提供に同意したものとみなされます。
          口コミの公開・非公開はプロジェクトオーナーの判断により行われます。
        </p>

        <h2 style={s.h2}>9. お問い合わせ</h2>
        <p style={s.p}>
          本ポリシーに関するお問い合わせは、以下までご連絡ください。
        </p>
        <p style={s.p}>
          運営: Mildsolt<br />
          メール: mildsolt.official@gmail.com
        </p>

        <h2 style={s.h2}>10. ポリシーの変更</h2>
        <p style={s.p}>
          本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、
          ユーザーに通知することなく変更できるものとします。
          変更後のプライバシーポリシーは、本サービス上に掲示した時点から効力を生じるものとします。
        </p>

        <div style={{ marginTop: 60, padding: "24px 0", borderTop: "1px solid #e2e8f0" }}>
          <a href="/" style={{ color: "#2563eb", textDecoration: "none", fontSize: 14 }}>← トップページに戻る</a>
        </div>
      </div>
    </div>
  );
}
