/*
* Run to migrate models and annotations from the test schema to the production schema
* Be sure to connect to the production schema for rollback test
* Comment rollback/uncomment commit to commit
*/

-- Start transaction
start transaction;

-- Migrate species 
insert into Production.species(
select d.*
from Test.species as d
left join Production.species as t
on d.spec_name = t.spec_name
where t.spec_name is null);

-- Migrate specimen
insert into Production.specimen(
select d.*
from Test.specimen as d
left join Production.specimen as t
on d.spec_acquis_date = t.spec_acquis_date and d.spec_name = t.spec_name
where t.spec_name is null);

-- Migrate annotated models 
insert into Production.model(
select d.* 
from Test.model as d
left join Production.model as t
on d.uid = t.uid
where t.uid is null and d.annotated is true);

-- Migrate image sets of migrated models
insert into Production.image_set(
select d.* 
from Test.image_set as d
left join Production.image_set as t
on d.spec_name = t.spec_name and d.spec_acquis_date = t.spec_acquis_date and d.set_no = t.set_no
where t.spec_name is null and d.uid is not null and d.uid in (select uid from Production.model));

-- Migrate annotations of migrated models
insert into Production.annotations(
select d.* from Test.annotations as d
left join Production.annotations as t
on d.annotation_id = t.annotation_id
where t.annotation_id is null and d.uid in (select uid from Production.model));

-- Migrate photo_annotations of migrated models
insert into Production.photo_annotation(
select d.* 
from Test.photo_annotation as d
left join Production.photo_annotation as t
on d.annotation_id = t.annotation_id
where t.annotation_id is null and d.annotation_id in (select annotation_id from Production.annotations));

-- Migrate video_annotations of migrated models
insert into Production.video_annotation(
select d.* 
from Test.video_annotation as d
left join Production.video_annotation as t
on d.annotation_id = t.annotation_id
where t.annotation_id is null and d.annotation_id in (select annotation_id from Production.annotations));

-- Migrate model_annotations of migrated models
insert into Production.model_annotation(
select d.* 
from Test.model_annotation as d
left join Production.model_annotation as t
on d.annotation_id = t.annotation_id
where t.annotation_id is null and d.annotation_id in (select annotation_id from Production.annotations));

rollback;
-- commit;