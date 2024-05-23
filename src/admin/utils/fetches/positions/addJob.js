import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function addJob(departmentId, jobTitle, description, selectedSkills, jobsLevelArray) {
    try {

        const data = JSON.stringify({
            query: `mutation insertJob($title: String, $description: String, $department_id: Int) {
            insert_jobs(objects: {department_id: $department_id, description: $description, title: $title}) {
                returning {
                    id
                    description
                    department_id
                }
            }
        }`,
            variables: {
                title: jobTitle,
                description: description,
                department_id: Number(departmentId)
            }
        });

        const response = await fetch(
            BaseUrl,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                    'Authorization': 'Bearer ' + getToken()
                },
                body: data
            }
        );

        const jsonJob = await response.json();
        if (jsonJob.errors) {
            console.error("Error:", jsonJob.errors);
            return false;
        }

        const jobId = jsonJob.data.insert_jobs.returning[0].id;


        for (let i = 0; i < jobsLevelArray.length; i++) {
            const {seniority, title, description} = jobsLevelArray[i];
            const seniorityId = seniority ? (seniority.id === null ? 0 : seniority.id) : 0;

                const dataJobLevel = JSON.stringify({
                    query: `mutation insertJobLevel($title: String, $description: String, $job_id: Int, $seniority_id: Int) {
                            insert_jobs_levels(objects: {title: $title, seniority_id: $seniority_id, job_id: $job_id, description: $description}) {
                                affected_rows
                                }
                            }`,
                    variables: {
                        job_id: jobId,
                        seniority_id: seniorityId,
                        title: title,
                        description: description
                    }
                });

                await fetch(
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

        }

        for (let i = 0; i < selectedSkills.length; i++) {
            const dataSkillJob = JSON.stringify({
                query: `mutation insertSkillsJobs ($job_id: Int, $skill_id: Int) {
                insert_skills_jobs(objects: [{job_id: $job_id, skill_id: $skill_id}]) {
                    affected_rows
                }
            }`,
                variables: {
                    job_id: jobId,
                    skill_id: selectedSkills[i].id
                }
            });

            await fetch(
                BaseUrl,
                {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': dataSkillJob.length,
                        'Authorization': 'Bearer ' + getToken()
                    },
                    body: dataSkillJob
                }
            );
        }

        return jsonJob;

    } catch (err) {
        console.error(err)
        return false
    }
}
