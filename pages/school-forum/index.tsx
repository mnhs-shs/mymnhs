import React from "react";
import styles from "./index.module.css";
import Layout from "../../components/_layout";
import Meta from "../../components/_meta";
import { GetStaticProps } from "next";
import dbExecute from "../../_operations/db/db";
import OuterForumLeft from "../../components/school-forum/left";
import OuterForumRight from "../../components/school-forum/right";
const SchoolPlatForm: React.FC = ({data}) => {
	return (
		<>
			<Meta
				title="School Forum | MyMNHS"
				description="MyMNHS School Platform lets you connect with your classmates and teachers in the school community of Meycauayan National High School. Be the best, choose MNHS!"
				url="/schoolPlatform"
				ogTitle="School Forum | MyMNHS"
				ogDescription="MyMNHS School Platform lets you connect with your classmates and teachers in the school community of Meycauayan National High School. Be the best, choose MNHS!"
				ogUrl="/schoolPlatform"
				twitterTitle="School Forum | MyMNHS"
				twitterDescription="MyMNHS School Platform lets you connect with your classmates and teachers in the school community of Meycauayan National High School. Be the best, choose MNHS!"
				twitterUrl="/schoolPlatform"
			/>

			<section className={styles.outermostForumSection}>
				<OuterForumLeft />
				<OuterForumRight />
			</section>
		</>
	);
};

const SchoolPlatFormPage: React.FC = () => {
	return (
		<>
			<Layout page={<SchoolPlatForm />} />
		</>
	);
};
export default SchoolPlatFormPage;

export const getStaticProps: GetStaticProps = async () => {
	const sql: string = `
			SELECT question_id, question_header, question_body, question_timestamp, account_first_name, account_last_name, section_grade, section_strand FROM forum_question_table
			JOIN account_table
			ON forum_question_table.question_asker_id = account_table.account_id
			JOIN section_table
			ON account_table.account_section_id = section_table.section_id
			ORDER BY question_timestamp DESC`;
	const [sqlData] = await dbExecute(sql);
	const data: any = JSON.parse(JSON.stringify(sqlData));
	return {
		props: {
			data,
		},
	};
};
