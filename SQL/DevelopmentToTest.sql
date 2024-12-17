/*
* Run to migrate models and annotations from the development schema to the test schema
* Be sure to connect to the test schema for rollback test
* Remove rollback/uncomment commit to commit
*/

-- Start transaction
start transaction;

-- Migrate species 
insert into Test.species(
select d.*
from Development.species as d
left join Test.species as t
on d.spec_name = t.spec_name
where t.spec_name is null);

-- Migrate specimen
insert into Test.specimen(
select d.*
from Development.specimen as d
left join Test.specimen as t
on d.spec_acquis_date = t.spec_acquis_date and d.spec_name = t.spec_name
where t.spec_name is null);

-- Migrate annotated models 
insert into Test.model(
select d.* 
from Development.model as d
left join Test.model as t
on d.uid = t.uid
where t.uid is null and d.annotated is true);

-- Migrate image sets of migrated models
insert into Test.image_set(
select d.* 
from Development.image_set as d
left join Test.image_set as t
on d.spec_name = t.spec_name and d.spec_acquis_date = t.spec_acquis_date and d.set_no = t.set_no
where t.spec_name is null and d.uid is not null and d.uid in (select uid from Test.model));

-- Migrate annotations of migrated models
insert into Test.annotations(
select d.* from Development.annotations as d
left join Test.annotations as t
on d.annotation_id = t.annotation_id
where t.annotation_id is null and d.uid in (select uid from Test.model));

-- Migrate photo_annotations of migrated models
insert into Test.photo_annotation(
select d.* 
from Development.photo_annotation as d
left join Test.photo_annotation as t
on d.annotation_id = t.annotation_id
where t.annotation_id is null and d.annotation_id in (select annotation_id from Test.annotations));

-- Migrate video_annotations of migrated models
insert into Test.video_annotation(
select d.* 
from Development.video_annotation as d
left join Test.video_annotation as t
on d.annotation_id = t.annotation_id
where t.annotation_id is null and d.annotation_id in (select annotation_id from Test.annotations));

-- Migrate model_annotations of migrated models
insert into Test.model_annotation(
select d.* 
from Development.model_annotation as d
left join Test.model_annotation as t
on d.annotation_id = t.annotation_id
where t.annotation_id is null and d.annotation_id in (select annotation_id from Test.annotations));

rollback;
-- commit;