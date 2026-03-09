import { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 - VoiceWall",
};

export default function Terms() {
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
        <h1 style={s.h1}>利用規約</h1>
        <p style={s.date}>最終更新日: 2026年3月9日</p>

        <h2 style={s.h2}>第1条（適用）</h2>
        <p style={s.p}>
          本利用規約（以下「本規約」）は、VoiceWall（以下「本サービス」）の利用条件を定めるものです。
          登録ユーザーの皆さま（以下「ユーザー」）には、本規約に従って本サービスをご利用いただきます。
        </p>

        <h2 style={s.h2}>第2条（利用登録）</h2>
        <p style={s.p}>
          本サービスの利用を希望する方は、本規約に同意のうえ、所定の方法により利用登録を申請し、
          運営者がこれを承認することで利用登録が完了するものとします。
        </p>

        <h2 style={s.h2}>第3条（アカウント管理）</h2>
        <p style={s.p}>
          ユーザーは、自己の責任において、本サービスのアカウント情報を適切に管理するものとします。
          アカウント情報の管理不十分、第三者の使用等によって生じた損害に関する責任はユーザーが負うものとします。
        </p>

        <h2 style={s.h2}>第4条（料金および支払い）</h2>
        <p style={s.p}>
          本サービスには無料プランと有料プラン（Proプラン）があります。有料プランの料金は、
          本サービスの料金ページに表示される金額とします。支払いはStripeを通じたクレジットカード決済により行われます。
          月額サブスクリプションは、解約手続きを行うまで毎月自動的に更新・課金されます。
        </p>

        <h2 style={s.h2}>第5条（解約）</h2>
        <p style={s.p}>
          ユーザーは、ダッシュボードの「プラン管理」からいつでもProプランを解約できます。
          解約した場合、次回の更新日をもって無料プランに移行します。既に支払った料金の返金は行いません。
        </p>

        <h2 style={s.h2}>第6条（禁止事項）</h2>
        <p style={s.p}>
          ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません：法令または公序良俗に違反する行為、
          犯罪行為に関連する行為、サーバーまたはネットワークの機能を破壊・妨害する行為、
          他のユーザーに成りすます行為、本サービスの運営を妨害する行為、
          不正アクセスまたはこれを試みる行為、反社会的勢力に対する利益供与、
          その他運営者が不適切と判断する行為。
        </p>

        <h2 style={s.h2}>第7条（サービスの提供の停止等）</h2>
        <p style={s.p}>
          運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく
          本サービスの全部または一部の提供を停止・中断することができるものとします：
          本サービスにかかるコンピュータシステムの保守点検、更新を行う場合、
          地震・落雷・火災・停電等の不可抗力により本サービスの提供が困難となった場合、
          その他運営者が本サービスの提供が困難と判断した場合。
        </p>

        <h2 style={s.h2}>第8条（コンテンツの権利）</h2>
        <p style={s.p}>
          ユーザーが本サービスに投稿・送信したコンテンツ（口コミ、テスティモニアル等）の著作権はユーザーに帰属します。
          ただし、ユーザーは運営者に対し、本サービスの提供・改善のために必要な範囲で
          これらのコンテンツを使用する権利を許諾するものとします。
        </p>

        <h2 style={s.h2}>第9条（免責事項）</h2>
        <p style={s.p}>
          運営者は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、
          特定の目的への適合性、セキュリティ等に関する欠陥、エラーやバグ、権利侵害等を含みます）
          がないことを明示的にも黙示的にも保証しておりません。
          運営者は、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。
        </p>

        <h2 style={s.h2}>第10条（規約の変更）</h2>
        <p style={s.p}>
          運営者は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
          変更後の本規約は、本サービス上に表示した時点から効力を生じるものとします。
        </p>

        <h2 style={s.h2}>第11条（準拠法・裁判管轄）</h2>
        <p style={s.p}>
          本規約の解釈にあたっては、日本法を準拠法とします。
          本サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄とします。
        </p>

        <div style={{ marginTop: 60, padding: "24px 0", borderTop: "1px solid #e2e8f0" }}>
          <a href="/" style={{ color: "#2563eb", textDecoration: "none", fontSize: 14 }}>← トップページに戻る</a>
        </div>
      </div>
    </div>
  );
}
