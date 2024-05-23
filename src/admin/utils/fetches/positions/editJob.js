import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function editJob(jobId, jobTitle, description, selectedSkills, selectedLevels) {
    try {
        // Оновлення роботи
        const jobData = JSON.stringify({
            query: `
                mutation updateJob($id: Int!, $title: String!, $description: String!) {
                    update_jobs(where: {id: {_eq: $id}}, _set: {title: $title, description: $description}) {
                        affected_rows
                    }
                }
            `,
            variables: {
                id: jobId,
                title: jobTitle,
                description: description
            }
        });

        const jobResponse = await fetch(BaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: jobData
        });

        const jobResult = await jobResponse.json();

        if (jobResult.errors) {
            console.error("Error updating job:", jobResult.errors);
            return false;
        }


        for (let i = 0; i < selectedLevels.length; i++) {
            const {id, seniority, title, description} = selectedLevels[i];


            let variables = {
                jlid: id,
                title: title,
                description: description
            };

            console.log("Job " + jobId)
            console.log("Variables ")
            console.log(variables)

            const dataJobLevel = JSON.stringify({
                query: `mutation updateJobsLevels($jlid: Int, $title: String, $description: String) {
                        update_jobs_levels(
                            where: {id: {_eq: $jlid}},
                            _set: {description: $description, title: $title}
                        ) {
                            affected_rows
                            returning {
                                id
                                job_id
                                title
                                description
                            }
                        }
                    }`,
                variables: variables
            });

            let jobLevels = await fetch(
                BaseUrl,
                {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': dataJobLevel.length,
                        'Authorization': 'Bearer ' + getToken()
                    },
                    body: dataJobLevel
                }
            );

            console.log( await jobLevels.json())
            console.log("=======================================")

        }

        // Upgrading skills for work
        const deleteSkillsData = JSON.stringify({
            query: `
                mutation deleteSkills($jobId: Int!) {
                    delete_skills_jobs(where: {job_id: {_eq: $jobId}}) {
                        affected_rows
                    }
                }
            `,
            variables: {
                jobId: jobId
            }
        });

        await fetch(BaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: deleteSkillsData
        });

        // Adding new skills to the job
        for (let i = 0; i < selectedSkills.length; i++) {
            const skillData = JSON.stringify({
                query: `
                    mutation insertSkillJob($jobId: Int!, $skillId: Int!) {
                        insert_skills_jobs(objects: {job_id: $jobId, skill_id: $skillId}) {
                            affected_rows
                        }
                    }
                `,
                variables: {
                    jobId: jobId,
                    skillId: selectedSkills[i].id
                }
            });

            await fetch(BaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: skillData
            });
        }

        return true;
    } catch (error) {
        console.error("Error updating job:", error);
        return false;
    }
}
